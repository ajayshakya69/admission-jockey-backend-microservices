import { Module } from "@nestjs/common"
import { ProxyController } from "./proxy.controller"
import { ProxyService } from "./proxy.service"
import { ServiceDiscoveryModule } from "../service-discovery/service-discovery.module"

@Module({
  imports: [ServiceDiscoveryModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
