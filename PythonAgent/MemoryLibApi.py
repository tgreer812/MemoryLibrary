import ctypes
from ctypes import wintypes
from ctypes import c_size_t

MAX_MODULE_NAME32 = 255

class ValueType(ctypes.c_uint):
    VT_INTEGER = 0
    VT_FLOAT = 1
    VT_STRING = 2

def get_value_type(value_type_str):
    if not value_type_str:
        return ValueType.VT_INTEGER
    elif value_type_str.lower() == 'int':
        return ValueType.VT_INTEGER
    elif value_type_str.lower() == 'float':
        return ValueType.VT_FLOAT
    elif value_type_str.lower() == 'string':
        return ValueType.VT_STRING
    else:
        raise ValueError(f"Invalid value type: {value_type_str}")

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

MemDll = ""
dll = None
GetModuleListFunc = None
GetModuleList = None
MemoryScan = None

def require_init(func):
    def wrapper(*args, **kwargs):
        if dll is None:
            raise Exception("memLibInit() has not been called")
        else:
            return func(*args, **kwargs)
    return wrapper


def memLibInit(dllPath):
    global MemDll, dll, GetModuleListFunc, GetModuleList, MemoryScan

    MemDll = dllPath
    dll = ctypes.WinDLL(MemDll)

    dll.GetProcessList.argtypes = [ctypes.POINTER(ProcessInfo), ctypes.c_int]
    dll.GetProcessList.restype = ctypes.c_int

    GetModuleListFunc = ctypes.CFUNCTYPE(
        ctypes.c_int,
        ctypes.POINTER(ModuleInfo),
        ctypes.c_int,
        wintypes.DWORD,
    )

    MemoryScan = MemoryScanFunc(('MemoryScan', dll))

    GetModuleList = GetModuleListFunc(('GetModuleList', dll))

@require_init
def get_process_list(process_list, max_processes):
    _process_list = (ProcessInfo * max_processes)()
    process_count = dll.GetProcessList(_process_list, max_processes)

    for i in range(process_count):
        process_list.append(_process_list[i])
    return process_count

@require_init
def get_module_list(module_list, max_modules, pid):
    _module_list = (ModuleInfo * max_modules)()
    module_count = GetModuleList(_module_list, max_modules, pid)

    for i in range(module_count):
        module_list.append(_module_list[i])

    return module_count

@require_init
def memory_scan(pid, value_type, value, start_address, end_address, alignment, found_addresses, max_found):
    found_addresses_array = (ctypes.c_uint64 * max_found)()

    # Convert found_addresses to ctypes.c_uint64 and add them to found_addresses_array
    for i, address in enumerate(found_addresses):
        if i >= max_found:
            raise Exception("found_addresses is larger than max_found")
        found_addresses_array[i] = ctypes.c_uint64(address)

    # Convert value to value = ctypes.c_int(value)
    value = ctypes.c_int(value)
    
    found_address_count = MemoryScan(
        pid,
        value_type,
        ctypes.byref(value),
        ctypes.sizeof(value),
        start_address,
        end_address,
        alignment,
        found_addresses_array,
        max_found
    )

    # Clear found_addresses and add the values from found_addresses_array as normal Python numbers
    found_addresses.clear()
    for i in range(found_address_count):
        if i >= max_found:
            break
        found_addresses.append(int(found_addresses_array[i]))

    return found_address_count


