// MemoryLib.cpp : Defines the exported functions for the DLL.
//

#include "MemoryLib.h"
#include "MemoryScan.h"
#include <Windows.h>
#include <TlHelp32.h>
#include <string>
#include <vector>
#include <thread>
#include <mutex>
#include <iostream>
#include "Logger.h"
#include <stdexcept>
#include <excpt.h>

//#define CATCH_STRUCTURED_EXCEPTIONS

#ifdef CATCH_STRUCTURED_EXCEPTIONS
int FilterStructuredException(unsigned int code, struct _EXCEPTION_POINTERS* ep) {
    // Log the exception code
    std::string exception_log = "Structured exception caught in _MemoryScan, code: " + std::to_string(code);
    LOG_ERROR(exception_log);
    return EXCEPTION_EXECUTE_HANDLER;
}
#endif // CATCH_STRUCTURED_EXCEPTIONS

//MEMORYLIB_API 
int _MemoryScan(DWORD pid, ValueType value_type, const void* value, size_t value_size, uintptr_t start_address, uintptr_t end_address, size_t alignment, uintptr_t* found_addresses, size_t max_found, const std::vector<size_t>& input_found_addresses) {
    LOG_INFO(
        "Called _MemoryScan with pid: %d, value_type: %d, value_size: %zu, start_address: %zu, end_address: %zu, alignment: %zu, max_found: %zu",
        pid, 
        value_type, 
        value_size, 
        start_address, 
        end_address, 
        alignment, 
        max_found
    );


#ifdef CATCH_STRUCTURED_EXCEPTIONS
    __try {
#endif
        try {
            size_t i = 0;

            switch (value_type) {
            case VT_INTEGER:
                if (value_size == sizeof(int)) {
                    auto addresses = scan_memory<int>(pid, *reinterpret_cast<const int*>(value), start_address, end_address, alignment, input_found_addresses);
                    for (const auto& addr : addresses) {
                        if (i < max_found) {
                            found_addresses[i] = addr.first;
                            i++;
                        }
                        else {
                            break;
                        }
                    }
                }
                break;
            case VT_FLOAT:
                if (value_size == sizeof(float)) {
                    auto addresses = scan_memory<float>(pid, *reinterpret_cast<const float*>(value), start_address, end_address, alignment, input_found_addresses);
                    for (const auto& addr : addresses) {
                        if (i < max_found) {
                            found_addresses[i] = addr.first;
                            i++;
                        }
                        else {
                            break;
                        }
                    }
                }
                break;
            case VT_STRING:
                // Implement string scanning here
                break;
            default:
                return -1;
            }

            return static_cast<int>(i);
        }
        catch (const std::exception& e) {
            LOG_ERROR("Exception caught in _MemoryScan: %s", e.what());
            return -1;
        }
        catch (...) {
            LOG_ERROR("Unknown exception caught in _MemoryScan");
            return -1;
        }
#ifdef CATCH_STRUCTURED_EXCEPTIONS
    __except (FilterStructuredException(GetExceptionCode(), GetExceptionInformation())) {
        // Handle the structured exception here
        result = -1;
    }
    return result;
#endif
}



extern "C" {
    int MemoryScan(DWORD pid, ValueType value_type, const void* value, size_t value_size, uintptr_t start_address, uintptr_t end_address, size_t alignment, uintptr_t* found_addresses, size_t max_found) {
        // Call the original MemoryScan function
        return _MemoryScan(pid, value_type, value, value_size, start_address, end_address, alignment, found_addresses, max_found);
    }

    int GetProcessList(ProcessInfo* process_list, int max_processes)
    {
        int process_count = 0;

        HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, NULL);

        if (snapshot == INVALID_HANDLE_VALUE)
        {
            return process_count;
        }

        PROCESSENTRY32W procEntry;
        procEntry.dwSize = sizeof(PROCESSENTRY32W);

        if (Process32First(snapshot, &procEntry))
        {
            do
            {
                if (process_count < max_processes)
                {
                    ProcessInfo process;
                    process.processID = procEntry.th32ProcessID;
                    wcsncpy_s(process.processName, MAX_PATH + 1, procEntry.szExeFile, _TRUNCATE);

                    process_list[process_count] = process;
                    process_count++;
                }
                else
                {
                    break;
                }
            } while (Process32NextW(snapshot, &procEntry));
        }

        CloseHandle(snapshot);

        return process_count;
    }

    int GetModuleList(ModuleInfo* module_list, int max_modules, DWORD pid)
    {
        int module_count = 0;

        HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE | TH32CS_SNAPMODULE32, pid);

        if (snapshot == INVALID_HANDLE_VALUE)
        {
            return module_count;
        }

        MODULEENTRY32W moduleEntry;
        moduleEntry.dwSize = sizeof(MODULEENTRY32W);

        if (Module32FirstW(snapshot, &moduleEntry))
        {
            do
            {
                if (module_count < max_modules)
                {
                    ModuleInfo moduleInfo;
                    wcsncpy_s(moduleInfo.moduleName, MAX_MODULE_NAME32 + 1, moduleEntry.szModule, _TRUNCATE);
                    wcsncpy_s(moduleInfo.modulePath, MAX_PATH + 1, moduleEntry.szExePath, _TRUNCATE);
                    moduleInfo.moduleBaseAddress = reinterpret_cast<size_t>(moduleEntry.modBaseAddr);
                    moduleInfo.moduleBaseSize = moduleEntry.modBaseSize;
                    module_list[module_count] = moduleInfo;
                    module_count++;
                }
                else
                {
                    break;
                }
            } while (Module32NextW(snapshot, &moduleEntry));
        }

        CloseHandle(snapshot);

        return module_count;
    }


}
