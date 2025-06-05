import { Injectable, Logger } from "@nestjs/common"
import type { Request, Response } from "express"
import axios from "axios"
import  { ServiceDiscoveryService } from "../service-discovery/service-discovery.service"

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name)

  constructor(private readonly serviceDiscovery: ServiceDiscoveryService) {}

  async proxyRequest(req: Request, res: Response, serviceName: string) {
    try {
      const instances = await this.serviceDiscovery.getServiceInstances(serviceName)

      if (instances.length === 0) {
        this.logger.error(`❌ No instances found for service: ${serviceName}`)
        return res.status(503).json({
          message: `Service ${serviceName} is not available`,
          statusCode: 503,
          timestamp: new Date().toISOString(),
        })
      }

      // Simple round-robin load balancing
      const instance = instances[Math.floor(Math.random() * instances.length)]
      const targetUrl = `http://${instance.address}:${instance.port}${req.url}`

      this.logger.debug(`🔄 Proxying request to: ${targetUrl}`)

      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        headers: {
          ...req.headers,
          host: `${instance.address}:${instance.port}`,
        },
        timeout: 30000,
        validateStatus: () => true,
      })

      // Forward response headers
      Object.keys(response.headers).forEach((key) => {
        if (key !== "transfer-encoding") {
          res.set(key, response.headers[key])
        }
      })

      return res.status(response.status).send(response.data)
    } catch (error) {
      this.logger.error(`❌ Proxy error for ${serviceName}:`, error.message)

      if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
        return res.status(503).json({
          message: `Service ${serviceName} is not available`,
          statusCode: 503,
          timestamp: new Date().toISOString(),
        })
      }

      return res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      })
    }
  }
}
