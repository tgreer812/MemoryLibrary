import ctypes
from ctypes import wintypes

def ReadProcessMemory(hProcess, lpBaseAddress, nSize, lpNumberOfBytesRead=None):
    lpBuffer = ctypes.create_string_buffer(nSize)
    if lpNumberOfBytesRead is None:
        lpNumberOfBytesRead = ctypes.c_size_t()
    ctypes.windll.kernel32.ReadProcessMemory(hProcess, lpBaseAddress, lpBuffer, nSize, ctypes.byref(lpNumberOfBytesRead))
    return lpBuffer.raw

def WriteProcessMemory(hProcess, lpBaseAddress, lpBuffer, nSize, lpNumberOfBytesWritten=None):
    if lpNumberOfBytesWritten is None:
        lpNumberOfBytesWritten = ctypes.c_size_t()
    ctypes.windll.kernel32.WriteProcessMemory(hProcess, lpBaseAddress, lpBuffer, nSize, ctypes.byref(lpNumberOfBytesWritten))
    return lpNumberOfBytesWritten.value

# Define the ProcessEntry32 structure
class ProcessEntry32(ctypes.Structure):
    _fields_ = [("dwSize", wintypes.DWORD),
                ("cntUsage", wintypes.DWORD),
                ("th32ProcessID", wintypes.DWORD),
                ("th32DefaultHeapID", ctypes.POINTER(wintypes.ULONG)),
                ("th32ModuleID", wintypes.DWORD),
                ("cntThreads", wintypes.DWORD),
                ("th32ParentProcessID", wintypes.DWORD),
                ("pcPriClassBase", wintypes.LONG),
                ("dwFlags", wintypes.DWORD),
                ("szExeFile", ctypes.c_char * 260)]

class ModuleEntry32(ctypes.Structure):
    _fields_ = [("dwSize", wintypes.DWORD),
                ("th32ModuleID", wintypes.DWORD),
                ("th32ProcessID", wintypes.DWORD),
                ("GlblcntUsage", wintypes.DWORD),
                ("ProccntUsage", wintypes.DWORD),
                ("modBaseAddr", ctypes.POINTER(wintypes.BYTE)),
                ("modBaseSize", wintypes.DWORD),
                ("hModule", wintypes.HMODULE),
                ("szModule", ctypes.c_char * 256),
                ("szExePath", ctypes.c_char * 260)]

def ListProcesses():
    processes = []
    snapshot = ctypes.windll.kernel32.CreateToolhelp32Snapshot(2, 0)
    process = ProcessEntry32()
    process.dwSize = ctypes.sizeof(process)
    if ctypes.windll.kernel32.Process32First(snapshot, ctypes.byref(process)):
        while True:
            processes.append((process.th32ProcessID, process.szExeFile))
            if not ctypes.windll.kernel32.Process32Next(snapshot, ctypes.byref(process)):
                break
    ctypes.windll.kernel32.CloseHandle(snapshot)
    return processes

def ListProcessModules(process_id):
    modules = []
    snapshot = ctypes.windll.kernel32.CreateToolhelp32Snapshot(0x00000008, process_id)
    module = ModuleEntry32()
    module.dwSize = ctypes.sizeof(module)
    if ctypes.windll.kernel32.Module32First(snapshot, ctypes.byref(module)):
        while True:
            modules.append(module)  # Store the entire ModuleEntry32 object
            module = ModuleEntry32()
            module.dwSize = ctypes.sizeof(module)
            if not ctypes.windll.kernel32.Module32Next(snapshot, ctypes.byref(module)):
                break
    ctypes.windll.kernel32.CloseHandle(snapshot)
    return modules

def get_process_base_address(pid, module_name):
    modules = ListProcessModules(pid)
    for module in modules:
        name = module.szModule.decode().lower()
        if name == module_name.lower():
            return module.modBaseAddr
    return None

def enumerate_module_sections(pid, module_name):
    hProcess = ctypes.windll.kernel32.OpenProcess(0x0010, False, pid)
    if hProcess == 0:
        raise Exception(f"Cannot open process {pid}")

    base_address = get_process_base_address(pid, module_name)
    if base_address is None:
        raise Exception(f"Module {module_name} not found in process {pid}")

    pe_data = ReadProcessMemory(hProcess, base_address, 4096)  # Read 4096 bytes, should be enough for headers
    pe = pefile.PE(data=pe_data, fast_load=True)

    sections = []
    for section in pe.sections:
        sections.append((section.Name.decode().rstrip('\x00'), section.VirtualAddress, section.Misc_VirtualSize))

    ctypes.windll.kernel32.CloseHandle(hProcess)
    return sections