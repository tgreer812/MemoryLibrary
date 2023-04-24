import argparse
import logging
#from MemoryLibApi import mem_lib_init, memory_scan, ValueType, get_value_type, get_process_list, get_module_list
import MemoryLibApi

MEM_LIB_INITIALIZED = False
log = logging.getLogger(__name__)

# Global dictionary to store registered command functions
COMMANDS = {}

def command(func):
    """
    Decorator to register command functions.
    """
    COMMANDS[func.__name__] = func
    return func

@command
def scan(args=None):
    print("In scan")
    if args is None:
        # Define command arguments
        parser = argparse.ArgumentParser()
        parser.add_argument("--pid", type=int, required=True)
        parser.add_argument("--type", type=str, required=True)
        parser.add_argument("--value", type=str, required=True)
        parser.add_argument("--start", type=int, required=True)
        parser.add_argument("--stop", type=int, required=True)
        parser.add_argument("--maxfound", type=int)
        return parser

    print(f"Scan command with args: {args}")

@command
def process_list(args=None):
    print("In process_list")
    if args is None:
        # Define command arguments
        parser = argparse.ArgumentParser()
        parser.add_argument("--maxprocesses", type=int, required=False, default=1024)
        return parser

    print(f"Process list command with args: {args}")
    proc_list = []
    response = {}
    response["processes"] = []
    MemoryLibApi.get_process_list(proc_list, args.maxprocesses)
    for proc in proc_list:
        print(f"Process: {proc.processName} PID: {proc.processID}")
        response["processes"].append({"name": proc.processName, "pid": proc.processID})
    print(f"Found {len(proc_list)} processes...")

    return response

def handle_task(task):
    global MEM_LIB_INITIALIZED
    if not MEM_LIB_INITIALIZED:
        MemoryLibApi.mem_lib_init("C:\\Users\\tgree\\source\\repos\\MemoryLibrary\\MemDLLTest\\x64\\Debug\\MemoryLib.dll")
        MEM_LIB_INITIALIZED = True

    log.debug(f"Handling task: {task}")

    command_name = task["command"]
    if command_name not in COMMANDS:
        log.error(f"Unknown command: {command_name}")
        return

    command_func = COMMANDS[command_name]
    arguments = task.get("arguments", [])

    parser = command_func()  # Add command-specific arguments to the parser

    try:
        args = parser.parse_args(arguments)
        command_response = command_func(args)

        if not command_response:
            command_response = {}
            log.error(f"Command {command_name} returned no response")

        response = {
            command_name: command_response
        }

        print(f"Response: {response}")
        return response

    except argparse.ArgumentError as e:
        log.error(f"Error in arguments: {e}")

    return {}
