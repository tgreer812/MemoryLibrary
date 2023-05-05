// dllmain.cpp : Defines the entry point for the DLL application.
#include <Windows.h>
#include "logger.h" // Assuming you have a header file for your logger implementation

BOOL APIENTRY DllMain(HMODULE hModule,
    DWORD  ul_reason_for_call,
    LPVOID lpReserved)
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        // Initialize your logger here
        init_logger();
        break;
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
        break;
    case DLL_PROCESS_DETACH:
        // Clean up your logger or other resources, if necessary
        break;
    }
    return TRUE;
}


