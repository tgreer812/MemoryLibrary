#pragma once
#include <Windows.h>
#include <string>
#include <vector>
#include "ValueType.h"
#include "tlhelp32.h"

#ifdef MEMORYLIB_EXPORTS
#define MEMORYLIB_API __declspec(dllexport)
#else
#define MEMORYLIB_API __declspec(dllimport)
#endif

struct ProcessInfo
{
    DWORD processID;
    wchar_t processName[MAX_PATH + 1];
};

struct ModuleInfo
{
    wchar_t     moduleName[MAX_MODULE_NAME32 + 1];
    wchar_t     modulePath[MAX_PATH + 1];
    size_t      moduleBaseAddress;
    size_t      moduleBaseSize;
};

// MemoryLib.h
MEMORYLIB_API int _MemoryScan(DWORD pid, ValueType value_type, const void* value, size_t value_size, uintptr_t start_address, uintptr_t end_address, size_t alignment, uintptr_t* found_addresses, size_t max_found);


// MemoryLib.h
extern "C" {
    MEMORYLIB_API int MemoryScan(DWORD pid, ValueType value_type, const void* value, size_t value_size, uintptr_t start_address, uintptr_t end_address, size_t alignment, uintptr_t* found_addresses, size_t max_found);
    MEMORYLIB_API int GetProcessList(ProcessInfo* process_list, int max_processes);
    MEMORYLIB_API int GetModuleList(ModuleInfo* module_list, int max_modules, DWORD pid);
}



