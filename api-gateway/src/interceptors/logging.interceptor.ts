import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler, Logger } from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP")

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const { method, url, ip, headers } = request
    const userAgent = headers["user-agent"] || ""
    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response
        const duration = Date.now() - start
        const logData = {
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          ip,
          userAgent,
        }

        // Color-coded logging based on status code
        if (statusCode >= 200 && statusCode < 300) {
          this.logger.log(`✅ ${method} ${url} - ${statusCode} - ${duration}ms`, JSON.stringify(logData))
        } else if (statusCode >= 400 && statusCode < 500) {
          this.logger.warn(`⚠️ ${method} ${url} - ${statusCode} - ${duration}ms`, JSON.stringify(logData))
        } else if (statusCode >= 500) {
          this.logger.error(`❌ ${method} ${url} - ${statusCode} - ${duration}ms`, JSON.stringify(logData))
        } else {
          this.logger.debug(`ℹ️ ${method} ${url} - ${statusCode} - ${duration}ms`, JSON.stringify(logData))
        }
      }),
    )
  }
}
