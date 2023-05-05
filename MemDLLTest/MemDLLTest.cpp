// MemDLLTest.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include "../MemoryLib/MemoryLib.h"
#include "../MemoryLib/ValueType.h"

int main()
{
    //const int MAX_PROCESSES = 1024;
    //ProcessInfo process_list[MAX_PROCESSES];
    //int process_count = GetProcessList(process_list, MAX_PROCESSES);

    ////const int MAX_MODULES = 128;
    ////ModuleInfo module_list[MAX_MODULES];
    ////int module_count = GetModuleList(module_list, MAX_MODULES, 372);
    ////for (int i = 0; i < module_count; ++i) {
    ////    std::wcout << L"Module name: " << module_list[i].moduleName << " base addr: 0x" << std::hex << module_list[i].moduleBaseAddress << std::endl;
    ////}


    //for (int i = 0; i < process_count; ++i)
    //{
    //    std::wcout << L"Process ID: " << process_list[i].processID << L", Process Name: " << process_list[i].processName << std::endl;
    //}

    uintptr_t found[50000];
    int* value = (int*)malloc(sizeof(int));
    *(value) = 37;

    int result = MemoryScan(
        27432,
        VT_INTEGER,
        (const void*)value,
        sizeof(int),
         0,
        0x7fffffffffff,
        4,
        found,
        50000
    );

    //if (!result) { return -1; }
    //int num_display = (result > 30) ? 30 : result;

    //for (int i = 0; i < num_display; i++) {
    //    std::cout << "Address: 0x" << std::hex << found[i] << " Value: 37" << std::endl;
    //}

}
