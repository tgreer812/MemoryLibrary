// Logger.h
#pragma once

#include <string>

enum LogType {
    LOG_INFO,
    LOG_WARNING,
    LOG_ERROR,
    LOG_DEBUG
};

void init_logger();
void log_message(LogType log_type, const std::string& file, int line, const char* format, ...);

#define LOG_INFO(...) log_message(LOG_INFO, __FILE__, __LINE__, __VA_ARGS__)
#define LOG_WARNING(...) log_message(LOG_WARNING, __FILE__, __LINE__, __VA_ARGS__)
#define LOG_ERROR(...) log_message(LOG_ERROR, __FILE__, __LINE__, __VA_ARGS__)
#define LOG_DEBUG(...) log_message(LOG_DEBUG, __FILE__, __LINE__, __VA_ARGS__)
