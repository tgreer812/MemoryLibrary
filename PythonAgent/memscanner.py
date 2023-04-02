'''
=========================================
            |   TOOL NAME   |           
=========================================

Creator: Tyler Greer
Date: 

Description:

Requirements:
'''


import argparse
import logging
import socket, threading

import pefile
import ctypes
from ctypes import c_size_t, Structure
from windowsapi import *

import struct

LOG_FORMAT = "[%(levelname)s] %(message)s"
LOG_DEBUG_FORMAT = "[%(threadName)s-%(filename)s-%(funcName)s-%(lineno)s | %(levelname)s] %(message)s"

log = logging.getLogger(__name__)



scan_options = {
    "scan_all": 0,
    "scan_modules": 1,
}

def scan(pid, value, value_type, start_address=0x0000000000000000, end_address=0x7fffffffffffffff, addresses=[]):
    hProcess = ctypes.windll.kernel32.OpenProcess(0x0010, False, pid)
    if hProcess == 0:
        raise Exception(f"Cannot open process {pid}")

    if value_type == 'string':
        value_bytes = value.encode()
    elif value_type == 'int':
        value_bytes = value.to_bytes(4, byteorder='little', signed=True)
    elif value_type == 'float':
        value_bytes = struct.pack('<f', value)
    else:
        raise Exception(f"Invalid value_type: {value_type}")

    value_len = len(value_bytes)
    found_addresses = []

    if not len(addresses):
        # Scan memory in chunks to avoid reading too much data at once
        chunk_size = 4096
        for chunk_start in range(start_address, end_address, chunk_size):
            chunk_end = min(chunk_start + chunk_size, end_address)
            raw_memory = ReadProcessMemory(hProcess, chunk_start, chunk_end - chunk_start)

            for offset in range(len(raw_memory) - value_len + 1, ):
                if raw_memory[offset:offset + value_len] == value_bytes:
                    virtual_address = chunk_start + offset
                    found_addresses.append((virtual_address, value))
    else:
        for address, _ in addresses:
            raw_memory = ReadProcessMemory(hProcess, address, value_len)
            if raw_memory == value_bytes:
                found_addresses.append((address, value))

    ctypes.windll.kernel32.CloseHandle(hProcess)
    return found_addresses

def fast_scan(pid, value, value_type, start_address=0x0000000000000000, end_address=0x7fffffffffffffff, addresses=[], alignment=4):
    hProcess = ctypes.windll.kernel32.OpenProcess(0x0010, False, pid)
    if hProcess == 0:
        raise Exception(f"Cannot open process {pid}")

    if value_type == 'string':
        value_bytes = value.encode()
    elif value_type == 'int':
        value_bytes = value.to_bytes(4, byteorder='little', signed=True)
    elif value_type == 'float':
        value_bytes = struct.pack('<f', value)
    else:
        raise Exception(f"Invalid value_type: {value_type}")

    value_len = len(value_bytes)
    found_addresses = []

    if not len(addresses):
        # Scan memory in chunks to avoid reading too much data at once
        chunk_size = 4096
        for chunk_start in range(start_address, end_address, chunk_size):
            chunk_end = min(chunk_start + chunk_size, end_address)
            raw_memory = ReadProcessMemory(hProcess, chunk_start, chunk_end - chunk_start)

            for offset in range(0, len(raw_memory) - value_len + 1, alignment):
                if raw_memory[offset:offset + value_len] == value_bytes:
                    virtual_address = chunk_start + offset
                    found_addresses.append((virtual_address, value))
    else:
        for address, _ in addresses:
            raw_memory = ReadProcessMemory(hProcess, address, value_len)
            if raw_memory == value_bytes:
                found_addresses.append((address, value))

    ctypes.windll.kernel32.CloseHandle(hProcess)
    return found_addresses

def test_loop():
    pid = 7976
    #pid = input("Enter a process ID: ")
    #pid = int(pid)

    while (True):
        print("Value types: 1. int, 2. float, 3. string, 4. aob")
        value_type = input("Enter a value type: ")

        val = input("Enter a value to scan for: ")
        if value_type == '1':
            val = int(val)
            value_type = 'int'
        elif value_type == '2':
            val = float(val)
            value_type = 'float'
        elif value_type == '3':
            val = val
            value_type = 'string'
        elif value_type == '4':
            val = val
            value_type = 'aob'
        else:
            print("Invalid value type")
            continue
        
        again = True
        start = 0x00000000006a0000
        end = 0x0000000000b4e000
        found_addresses = []
        while (again):
            #found_addresses = scan(pid=pid, value=val, value_type=value_type, start_address=start, end_address=end, addresses=found_addresses)
            found_addresses = fast_scan(pid=pid, value=val, value_type=value_type, start_address=start, end_address=end, addresses=found_addresses)
    
            print(f"Found {len(found_addresses)} addresses:")
            for i in range (20):
                #print(found_addresses[i])
                print("Address: ", hex(found_addresses[i][0]), "Value: ", found_addresses[i][1])
            print("...")

            again = input("Scan again? (y/n): ")
            if again == 'y':
                again = True
            else:
                break

            val = input("Enter next value to scan for: ")
            if value_type == '1':
                val = int(val)
            elif value_type == '2':
                val = float(val)
            elif value_type == '3':
                val = val
            elif value_type == '4':
                val = val
            else:
                print("Invalid value type")
                continue

class ProcessInfo(ctypes.Structure):
    _fields_ = [
        ("processID", wintypes.DWORD),
        ("processName", wintypes.WCHAR * (ctypes.wintypes.MAX_PATH + 1)),
    ]

MAX_MODULE_NAME32 = 255
    
class ModuleInfo(ctypes.Structure):
    _fields_ = [
        ("moduleName",          wintypes.WCHAR * (MAX_MODULE_NAME32 + 1)),
        ("modulePath",          wintypes.WCHAR * (ctypes.wintypes.MAX_PATH + 1)),
        ("moduleBaseAddress",   c_size_t),
        ("moduleSize",          c_size_t),
    ]

MemDll = "C:\\Users\\tgree\\source\\repos\\MemoryLibrary\\MemDLLTest\\x64\\Debug\\MemoryLib.dll"
dll = ctypes.WinDLL(MemDll)

# Enum definition for ValueType
class ValueType(ctypes.c_uint):
    VT_INTEGER = 0
    VT_FLOAT = 1
    VT_STRING = 2

def dllMemoryScan(pid, value_type, value, start_address, end_address, alignment, found_addresses, max_found):


    # Function signature for MemoryScan
    MemoryScanFunc = ctypes.CFUNCTYPE(
        ctypes.c_int,
        wintypes.DWORD,
        ValueType,
        ctypes.c_void_p,
        ctypes.c_size_t,
        ctypes.c_uint64,
        ctypes.c_uint64,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_uint64),
        ctypes.c_size_t
    )

    # Import the MemoryScan function
    MemoryScan = MemoryScanFunc(('MemoryScan', dll))

    value = ctypes.c_int(value)

    # Call MemoryScan
    result = MemoryScan(
        pid,
        value_type,
        ctypes.byref(value),
        ctypes.sizeof(value),
        start_address,
        end_address,
        alignment,
        found_addresses,
        max_found
    )

    return result

class ProcessInfo(ctypes.Structure):
    _fields_ = [
        ("processID", wintypes.DWORD),
        ("processName", wintypes.WCHAR * (ctypes.wintypes.MAX_PATH + 1)),
    ]

dll.GetProcessList.argtypes = [ctypes.POINTER(ProcessInfo), ctypes.c_int]
dll.GetProcessList.restype = ctypes.c_int

def do_process_list():
    MAX_PROCESSES = 1024
    process_list = (ProcessInfo * MAX_PROCESSES)()
    process_count = dll.GetProcessList(process_list, MAX_PROCESSES)

    for i in range(process_count):
        print(f"Process ID: {process_list[i].processID}, Process Name: {process_list[i].processName}")


def do_memory_scan():
     #pid = int(input("Enter a pid to scan: "))
    pid = 372
    value = int(input("Enter a value to scan for: "))

    value_type = ValueType.VT_INTEGER
    #value = 42
    start_address   = 0x000000000000
    end_address     = 0x7fffffffffff
    alignment       = 4
    max_found       = 1000000
    found_addresses = (ctypes.c_uint64 * max_found)()

    result = dllMemoryScan(pid, value_type, value, start_address, end_address, alignment, found_addresses, max_found)

    if result >= 0:
        print(f"Found {result} addresses:")
        # for i in range(result):
        #     print(hex(found_addresses[i]), ": ", value)

GetModuleListFunc = ctypes.CFUNCTYPE(
    ctypes.c_int,
    ctypes.POINTER(ModuleInfo),
    ctypes.c_int,
    wintypes.DWORD,
)
GetModuleList = GetModuleListFunc(('GetModuleList', dll))

def do_module_list():
    pid = 372
    MAX_MODULES = 128
    module_list = (ModuleInfo * MAX_MODULES)()
    module_count = GetModuleList(module_list, MAX_MODULES, pid)

    for i in range(module_count):
        print(f"Module Name: {module_list[i].moduleName} Base Address: {hex(module_list[i].moduleBaseAddress)} Size: {hex(module_list[i].moduleSize)})")

def run(args):
    do_process_list()
    #do_module_list()
		
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
    parser.add_argument("--debug", action="store_true", default=False, help="Show debug information")
    parser.add_argument("--logging", type=str, help="Log file")
    args = parser.parse_args()

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
