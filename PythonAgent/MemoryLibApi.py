import ctypes
from ctypes import wintypes
from ctypes import c_size_t

MAX_MODULE_NAME32 = 255

class ValueType(ctypes.c_uint):
    VT_INTEGER = 0
    VT_FLOAT = 1
    VT_STRING = 2

class ProcessInfo(ctypes.Structure):
    _fields_ = [
        ("processID", wintypes.DWORD),
        ("processName", wintypes.WCHAR * (ctypes.wintypes.MAX_PATH + 1)),
    ]

class ModuleInfo(ctypes.Structure):
    _fields_ = [
        ("moduleName",          wintypes.WCHAR * (MAX_MODULE_NAME32 + 1)),
        ("modulePath",          wintypes.WCHAR * (ctypes.wintypes.MAX_PATH + 1)),
        ("moduleBaseAddress",   c_size_t),
        ("moduleSize",          c_size_t),
    ]

MemDll = "C:\\Users\\tgree\\source\\repos\\MemoryLibrary\\MemDLLTest\\x64\\Debug\\MemoryLib.dll"
dll = ctypes.WinDLL(MemDll)

dll.GetProcessList.argtypes = [ctypes.POINTER(ProcessInfo), ctypes.c_int]
dll.GetProcessList.restype = ctypes.c_int

def get_process_list(process_list, max_processes):
    _process_list = (ProcessInfo * max_processes)()
    process_count = dll.GetProcessList(_process_list, max_processes)

    for i in range(process_count):
        process_list.append(_process_list[i])
    return process_count

GetModuleListFunc = ctypes.CFUNCTYPE(
    ctypes.c_int,
    ctypes.POINTER(ModuleInfo),
    ctypes.c_int,
    wintypes.DWORD,
)
GetModuleList = GetModuleListFunc(('GetModuleList', dll))

def get_module_list(module_list, max_modules, pid):
    return GetModuleList(module_list, max_modules, pid)

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

MemoryScan = MemoryScanFunc(('MemoryScan', dll))

def memory_scan(pid, value_type, value, start_address, end_address, alignment, found_addresses, max_found):
    return MemoryScan(
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
