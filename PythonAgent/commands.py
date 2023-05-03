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
    """
    Scan a process's memory for a specific value.

    If `args` is None, return an ArgumentParser for the command.
    Otherwise, execute the command and return a dictionary containing the result of the memory scan.

    :param args: Parsed command arguments, or None to return an ArgumentParser
    :return: A dictionary containing the result of the memory scan, or an ArgumentParser if args is None
    """
    if args is None:
        # Define command arguments
        parser = argparse.ArgumentParser()
        parser.add_argument("--pid", type=int, required=True)
        parser.add_argument("--type", type=str, required=True)
        parser.add_argument("--value", type=str, required=True)
        parser.add_argument("--start", type=int, required=True)
        parser.add_argument("--stop", type=int, required=True)
        parser.add_argument("--maxfound", type=int)
        parser.add_argument("--alignment", type=int, default=1)  # Add missing argument
        return parser

    print(f"Scan command with args: {args}")

    # Parse value type
    value_type = MemoryLibApi.get_value_type(args.type)

    # Convert value to appropriate type
    value = None
    if value_type == MemoryLibApi.ValueType.VT_INTEGER:
        value = int(args.value)
    elif value_type == MemoryLibApi.ValueType.VT_FLOAT:
        value = float(args.value)
    elif value_type == MemoryLibApi.ValueType.VT_STRING:
        value = args.value

    # Initialize found_addresses list
    found_addresses = []

    # Call memory_scan
    found_count = MemoryLibApi.memory_scan(
        args.pid,
        value_type,
        value,
        args.start,
        args.stop,
        args.alignment,  # Pass the alignment argument
        found_addresses,
        args.maxfound if args.maxfound is not None else 1024  # Set default value for maxfound
    )

    # Create response object
    response = {
        "found_count": found_count,
        "found_addresses": found_addresses
    }

    return response


@command
def process_list(args=None):
    """
    Get a list of running processes.

    If `args` is None, return an ArgumentParser for the command.
    Otherwise, execute the command and return a dictionary containing the list of running processes.

    :param args: Parsed command arguments, or None to return an ArgumentParser
    :return: A dictionary containing the list of running processes, or an ArgumentParser if args is None
    """
    if args is None:
        # Define command arguments
        parser = argparse.ArgumentParser()
        parser.add_argument("--maxprocesses", type=int, required=False, default=1024)
        return parser

    proc_list = []
    response = {}
    response["processes"] = []
    MemoryLibApi.get_process_list(proc_list, args.maxprocesses)
    for proc in proc_list:
        response["processes"].append({"name": proc.processName, "pid": proc.processID})

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

    # Add command-specific arguments to the parser
    parser = command_func()  

    try:
        args = parser.parse_args(arguments)

        # Call the command function with the arguments
        command_response = command_func(args)

        if not command_response:
            command_response = {}
            log.error(f"Command {command_name} returned no response")

        response = {
            command_name: command_response
        }

        return response

    except argparse.ArgumentError as e:
        log.error(f"Error in arguments: {e}")

    return {}
