import { Request, Response } from "express"

import axios from "axios"
import { serviceDiscovery } from "@/services/serviceDiscovery.service"
import { logger } from "@/utils/logger"

// Dynamic proxy middleware
export async function proxyRequest(req: Request, res: Response, serviceName: string): Promise<void> {
  try {
    const instances = await serviceDiscovery.getServiceInstances(serviceName)

    if (instances.length === 0) {
      res.status(503).json({
        message: `${serviceName} service unavailable`,
        statusCode: 503,
        timestamp: new Date().toISOString(),
      })
      return
    }

    // Simple round-robin load balancing
    const instance = instances[Math.floor(Math.random() * instances.length)]
    const targetUrl = `http://${instance.address}:${instance.port}${req.originalUrl}`

    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      headers: { ...req.headers, host: undefined },
      data: req.body,
      timeout: 30000,
      validateStatus: () => true,
    })

    // Forward response headers
    Object.keys(response.headers).forEach((key) => {
      if (key !== "transfer-encoding") {
        res.set(key, response.headers[key])
      }
    })

    res.status(response.status).send(response.data)
  } catch (error) {
    logger.error("Proxy request failed:", {
      serviceName,
      error: error instanceof Error ? error.message : "Unknown error",
      url: req.originalUrl,
    })

    res.status(500).json({
      message: "Service temporarily unavailable",
      statusCode: 500,
      timestamp: new Date().toISOString(),
    })
  }
}