import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler, Logger } from "@nestjs/common"
import { throwError, type Observable } from "rxjs"
import { catchError, tap } from "rxjs/operators"

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
        this.logger.log(`✅ ${method} ${url} - ${statusCode} - ${duration}ms`, JSON.stringify({ method, url, statusCode, duration: `${duration}ms`, ip, userAgent }))
      }),
      catchError((error) => {
        const duration = Date.now() - start
        const statusCode = error.status || 500
        this.logger.error(`❌ ${method} ${url} - ${statusCode} - ${duration}ms`, JSON.stringify({ method, url, statusCode, duration: `${duration}ms`, ip, userAgent, message: error.message }))
        return throwError(() => error)
      })
    )
    
  }
}
