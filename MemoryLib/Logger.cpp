// Logger.cpp
#include "Logger.h"
#include <fstream>
#include <mutex>
#include <cstdarg> // Include for va_list, va_start, va_end

std::ofstream log_file;
std::mutex log_mutex;

std::string log_type_to_string(LogType log_type) {
    switch (log_type) {
    case LOG_INFO: return "INFO";
    case LOG_WARNING: return "WARNING";
    case LOG_ERROR: return "ERROR";
    case LOG_DEBUG: return "DEBUG";
    default: return "UNKNOWN";
    }
}

void init_logger() {
    log_file.open("MemLib.log", std::ios::out | std::ios::app);
}

void log_message(LogType log_type, const std::string& file, int line, const char* format, ...) {
    std::unique_lock<std::mutex> lock(log_mutex);

    char buffer[1024];
    va_list args;
    va_start(args, format);
    vsnprintf(buffer, sizeof(buffer), format, args);
    va_end(args);

    log_file << log_type_to_string(log_type) << " [" << file << ":" << line << "] " << buffer << std::endl;
}