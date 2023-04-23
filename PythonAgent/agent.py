import argparse
import logging
import time
import json
from MemoryLibApi import mem_lib_init, memory_scan, ValueType, get_value_type, get_process_list, get_module_list

LOG_FORMAT = "[%(levelname)s] %(message)s"
LOG_DEBUG_FORMAT = "[%(threadName)s-%(filename)s-%(funcName)s-%(lineno)s | %(levelname)s] %(message)s"

log = logging.getLogger(__name__)

class SymbolFormatter(logging.Formatter):
    symbols = ["x", "!", "-", "+", "DBG"]

    def format(self, record):
        symbol_record = logging.makeLogRecord(vars(record))

        for index, symbol in enumerate(self.symbols):
            if record.levelno >= (len(self.symbols) - index) * 10:
                symbol_record.levelname = symbol
                break

        return super(SymbolFormatter, self).format(symbol_record)
    
def value_cast(value, value_type):
    if value_type == ValueType.VT_INTEGER:
        return int(value)
    elif value_type == ValueType.VT_FLOAT:
        return float(value)
    elif value_type == ValueType.VT_STRING:
        return value
    else:
        raise ValueError(f"Invalid value type: {value_type}")

def run(args):

    print(f"config: {args.config}")
    config = json.loads("{\"found_addresses\":[]}")
    mem_lib_init("C:\\Users\\tgree\\source\\repos\\MemoryLibrary\\MemDLLTest\\x64\\Debug\\MemoryLib.dll")

    if args.scan:
        pid = args.pid
        value_type = get_value_type(args.value_type)
        value = value_cast(args.value, value_type)
        start_address = args.start_address
        end_address = args.end_address
        alignment = args.alignment
        max_found = args.max_found

        found_addresses = config["found_addresses"]
        num_found = 0
        try:
            num_found = memory_scan(pid, value_type, value, start_address, end_address, alignment, found_addresses, max_found)
        except Exception as e:
            print(f"Error: {e}")
            return

        print(f"Found {len(found_addresses)} addresses:")
        # for address in found_addresses:
        #     print(hex(address), " value: ", value)

        with open("newconfig.json", "w") as f:
            json.dump(config, f, indent=4)

    elif args.process_list:
        proc_list = []
        get_process_list(proc_list, 1024)
        for proc in proc_list:
            print(f"Process: {proc.processName} PID: {proc.processID}")
        print(f"Found {len(proc_list)} processes...")

    elif args.module_list:
        module_list = []
        get_module_list(module_list, 1024, args.pid)

        for mod in module_list:
            print(f"Module: {mod.moduleName} Path: {mod.modulePath} Base: {hex(mod.moduleBaseAddress)} Size: {hex(mod.moduleSize)}")
        print(f"Found {len(module_list)} modules...")


def main():

    parser = argparse.ArgumentParser()
    parser.add_argument("--debug", action="store_true", default=False, help="Show debug information")
    parser.add_argument("--logging", type=str, help="Log file")
    parser.add_argument("--scan", action="store_true", help="Perform memory scan")
    parser.add_argument("--process-list", action="store_true", help="List running processes")
    parser.add_argument("--module-list", action="store_true", help="List modules of a specific process")
    parser.add_argument("--pid", type=int, help="Specify the process ID")
    parser.add_argument("--value-type", type=str, help="Specify the value type (int, float, string)")
    parser.add_argument("--value", type=str, help="Specify the value to scan for")
    parser.add_argument("--start-address", type=lambda x: int(x, 0), default=0x0, help="Specify the start address")
    parser.add_argument("--end-address", type=lambda x: int(x, 0), default=0x7fffffffffffffff, help="Specify the end address")
    parser.add_argument("--alignment", type=int, default=4, help="Specify the alignment")
    parser.add_argument("--max-found", type=int, default=1000000, help="Specify the maximum number of found addresses")
    parser.add_argument("--config", type=str, help="JSON configuration information (string)")

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
