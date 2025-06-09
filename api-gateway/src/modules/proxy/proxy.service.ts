import { Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import axios from "axios";
import { ServiceDiscoveryService } from "../service-discovery/service-discovery.service";
import getRawBody from "raw-body";

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly serviceDiscovery: ServiceDiscoveryService) {}

  async proxyRequest(req: Request, res: Response, serviceName: string) {
    try {
      const instances =
        await this.serviceDiscovery.getServiceInstances(serviceName);

      if (instances.length === 0) {
        this.logger.error(`❌ No instances found for service: ${serviceName}`);
        return res.status(503).json({
          message: `Service ${serviceName} is not available`,
          statusCode: 503,
          timestamp: new Date().toISOString(),
        });
      }

      // Simple round-robin load balancing
      const instance = instances[Math.floor(Math.random() * instances.length)];
      const targetUrl = `http://${instance.address}:${instance.port}${req.url}`;

      this.logger.debug(`🔄 Proxying request to: ${targetUrl}`);

      Logger.log("body in proxyRequest", req.body);

      let body: any = undefined;
      const contentType = req.headers['content-type'] || '';

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) {
          body = req.body; // already parsed by body-parser middleware
        } else if (req.readable && !req.body) {
          body = await getRawBody(req); // only if still readable and not parsed
        } else {
          this.logger.warn("Skipping body parsing: stream not readable or already parsed.");
        }
      }

      console.log("after checking body in proxyRequest new body", body);
      console.log("after checking body in proxyRequest old request with into", req.body);
      console.log("after checking body in proxyRequest old with the methods",  req.method);
      console.log("after checking body in proxyRequest targeturl",  targetUrl);
      

      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: body,
        headers: {
          ...req.headers,
          host: `${instance.address}:${instance.port}`,
        },
        timeout: 30000,
        validateStatus: () => true,
      });

      // Forward response headers
      Object.keys(response.headers).forEach((key) => {
        if (key !== "transfer-encoding") {
          res.set(key, response.headers[key]);
        }
      });

      return res.status(response.status).send(response.data);
    } catch (error) {
      this.logger.error(`❌ Proxy error for ${serviceName}:`, error.message);
      this.logger.error(`❌ Proxy full error for ${serviceName}:`, error);

      if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
        return res.status(503).json({
          message: `Service ${serviceName} is not available`,
          statusCode: 503,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
