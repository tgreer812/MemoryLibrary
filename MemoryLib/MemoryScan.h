#pragma once

#include <Windows.h>
#include <cstdint>
#include <vector>
#include <thread>
#include <stdexcept>
#include "ValueType.h"
#include "MemoryScan.h"
#include "MemoryLib.h"


template <typename T>
std::vector<std::pair<size_t, T>> scan_memory(DWORD pid, T value, size_t start_address, size_t end_address, size_t alignment, const std::vector<size_t>& input_found_addresses = {}) {
    HANDLE hProcess = OpenProcess(PROCESS_VM_READ | PROCESS_QUERY_INFORMATION, FALSE, pid);
    if (hProcess == NULL) {
        throw std::runtime_error("Cannot open process");
    }

    std::vector<std::pair<size_t, T>> found_addresses;

    if (input_found_addresses.empty()) {
        auto scan_chunk = [&](size_t chunk_start, size_t chunk_end) {
            MEMORY_BASIC_INFORMATION mbi;
            size_t current_addr = chunk_start;

            while (current_addr < chunk_end) {
                if (VirtualQueryEx(hProcess, reinterpret_cast<LPCVOID>(current_addr), &mbi, sizeof(mbi)) == 0) {
                    volatile DWORD lastError = GetLastError();
                    break;
                }

                if (mbi.State == MEM_COMMIT) {
                    size_t region_size = mbi.RegionSize - (current_addr - reinterpret_cast<size_t>(mbi.BaseAddress));
                    std::vector<char> buffer(region_size);

                    SIZE_T bytesRead;
                    if (ReadProcessMemory(hProcess, reinterpret_cast<LPCVOID>(current_addr), buffer.data(), region_size, &bytesRead)) {
                        for (size_t offset = 0; offset < bytesRead - sizeof(T); offset += alignment) {
                            if (*reinterpret_cast<T*>(&buffer[offset]) == value) {
                                found_addresses.push_back(std::make_pair(current_addr + offset, value));
                            }
                        }
                    }
                }

                current_addr += mbi.RegionSize;
            }
        };

        std::vector<std::thread> threads;
        size_t num_threads = std::thread::hardware_concurrency();
        size_t chunk_size = (end_address - start_address) / num_threads;

        for (size_t i = 0; i < num_threads; i++) {
            size_t chunk_start = start_address + i * chunk_size;
            size_t chunk_end = (i == num_threads - 1) ? end_address : chunk_start + chunk_size;
            threads.emplace_back(scan_chunk, chunk_start, chunk_end);
        }

        for (auto& t : threads) {
            t.join();
        }

    }
    else {
        auto read_and_check = [&](size_t start_idx, size_t end_idx) {
            for (size_t i = start_idx; i < end_idx; ++i) {
                T buffer;
                SIZE_T bytesRead;
                size_t target_address = input_found_addresses[i];

                if (ReadProcessMemory(hProcess, reinterpret_cast<LPCVOID>(target_address), &buffer, sizeof(T), &bytesRead)) {
                    if (buffer == value) {
                        found_addresses.push_back(std::make_pair(target_address, value));
                    }
                }
            }
        };

        std::vector<std::thread> threads;
        size_t num_threads = std::thread::hardware_concurrency();
        size_t addresses_per_thread = input_found_addresses.size() / num_threads;

        for (size_t i = 0; i < num_threads; i++) {
            size_t start_idx = i * addresses_per_thread;
            size_t end_idx = (i == num_threads - 1) ? input_found_addresses.size() : start_idx + addresses_per_thread;
            threads.emplace_back(read_and_check, start_idx, end_idx);
        }

        for (auto& t : threads) {
            t.join();
        }
    }

    CloseHandle(hProcess);
    return found_addresses;
}
