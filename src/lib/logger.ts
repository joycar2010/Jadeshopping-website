// 环境可控的轻量日志工具（带内存缓冲，便于页面展示最近日志）
// 使用方法：
//  - 在开发环境设置 `VITE_DEBUG_LOGS=true` 开启 info/debug 日志
//  - error/warn/summary 默认始终输出，避免隐藏问题
//  - 通过 getRecentLogs(15) 获取最近 15 条日志用于排查

type LogArgs = any[]

type LogLevel = 'info' | 'debug' | 'warn' | 'error' | 'summary'
type LogEntry = { level: LogLevel; args: LogArgs; time: string }

const MAX_BUFFER = 200
const logBuffer: LogEntry[] = []

const pushLog = (level: LogLevel, args: LogArgs) => {
  const entry: LogEntry = { level, args, time: new Date().toISOString() }
  logBuffer.push(entry)
  if (logBuffer.length > MAX_BUFFER) {
    logBuffer.splice(0, logBuffer.length - MAX_BUFFER)
  }
}

const isDebugEnabled = (): boolean => {
  const mode = import.meta.env.MODE
  const flag = import.meta.env.VITE_DEBUG_LOGS
  // 仅在开发环境且显式开启时输出详细日志
  return mode !== 'production' && String(flag).toLowerCase() === 'true'
}

export const logger = {
  info: (...args: LogArgs) => {
    if (isDebugEnabled()) {
      console.info(...args)
      pushLog('info', args)
    }
  },
  debug: (...args: LogArgs) => {
    if (isDebugEnabled()) {
      console.debug(...args)
      pushLog('debug', args)
    }
  },
  warn: (...args: LogArgs) => {
    console.warn(...args)
    pushLog('warn', args)
  },
  error: (...args: LogArgs) => {
    console.error(...args)
    pushLog('error', args)
  },
  summary: (label: string, data?: unknown) => {
    // 始终输出一行概要，便于排查
    if (data !== undefined) {
      console.log(`${label}:`, data)
      pushLog('summary', [label, data])
    } else {
      console.log(label)
      pushLog('summary', [label])
    }
  }
}

export const getRecentLogs = (limit = 15): LogEntry[] => {
  return logBuffer.slice(-limit)
}

export default logger