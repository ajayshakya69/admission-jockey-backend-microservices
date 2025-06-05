export interface ServiceInstance {
  address: string
  port: number
}

export interface ConsulService {
  ServiceAddress?: string
  Address: string
  ServicePort: number
}

export interface ProxyRequestOptions {
  method: string
  url: string
  headers: Record<string, any>
  data?: any
  validateStatus: () => boolean
}

export interface HealthCheckResponse {
  status: string
  timestamp: string
  service: string
}

export interface ErrorResponse {
  message: string
  error?: string
  statusCode: number
  timestamp: string
}
