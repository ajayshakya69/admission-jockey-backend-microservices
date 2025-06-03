import axios from "axios"
import type { ServiceInstance, ConsulService } from "../types"
import { logger } from "../utils/logger"

const CONSUL_BASE_URL = process.env.CONSUL_URL || "http://service-discovery:8500/v1/catalog/service"

export class ServiceDiscoveryService {
  async getServiceInstances(serviceName: string): Promise<ServiceInstance[]> {
    try {
      const response = await axios.get<ConsulService[]>(`${CONSUL_BASE_URL}/${serviceName}`)

      return response.data.map((instance) => ({
        address: instance.ServiceAddress || instance.Address,
        port: instance.ServicePort,
      }))
    } catch (error) {
      logger.error("Error fetching service instances from Consul:", {
        serviceName,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return []
    }
  }

  async registerService(serviceName: string, serviceId: string, address: string, port: number): Promise<void> {
    try {
      await axios.put(`http://service-discovery:8500/v1/agent/service/register`, {
        ID: serviceId,
        Name: serviceName,
        Address: address,
        Port: port,
        Check: {
          HTTP: `http://${address}:${port}/health`,
          Interval: "10s",
          DeregisterCriticalServiceAfter: "1m",
        },
      })
      logger.info("Service registered with Consul", { serviceName, serviceId })
    } catch (error) {
      logger.error("Failed to register service with Consul:", {
        serviceName,
        serviceId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  async deregisterService(serviceId: string): Promise<void> {
    try {
      await axios.put(`http://service-discovery:8500/v1/agent/service/deregister/${serviceId}`)
      logger.info("Service deregistered from Consul", { serviceId })
    } catch (error) {
      logger.error("Failed to deregister service from Consul:", {
        serviceId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }
}

export const serviceDiscovery = new ServiceDiscoveryService()
