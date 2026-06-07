import winston from "winston"

const { combine, timestamp, colorize, printf, json } = winston.format

const devFormat = printf(({ level, message, timestamp, service, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ""
  return `${timestamp} [${service || "app"}] ${level}: ${message}${metaStr}`
})

export function createLogger(service: string) {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    defaultMeta: { service },
    transports: [
      new winston.transports.Console({
        format:
          process.env.NODE_ENV === "production"
            ? combine(timestamp(), json())
            : combine(timestamp({ format: "HH:mm:ss" }), colorize(), devFormat)
      })
    ]
  })
}
