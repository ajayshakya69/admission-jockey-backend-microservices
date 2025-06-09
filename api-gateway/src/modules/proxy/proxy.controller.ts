import { Controller, All, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { ProxyService } from "./proxy.service";
import { AuthGuard } from "../../guards/auth.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Proxy module")
@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All("auth/*")
  @ApiOperation({
    summary: "Proxy requests to the auth service",
    description: "This endpoint proxies all requests to the auth service.",
  })
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    console.log("Proxying request to auth service");
    return this.proxyService.proxyRequest(req, res, "auth-service");
  }
  @All("test")
  async test(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({
      message: "API Gateway is working",
      timestamp: new Date().toISOString(),
    });
  }
  @All("users/*")
  @UseGuards(AuthGuard)
  async proxyUsers(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, "user-service");
  }

  @All("colleges/*")
  async proxyColleges(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, "college-service");
  }

  @All("applications/*")
  @UseGuards(AuthGuard)
  async proxyApplications(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, "application-service");
  }

  @All("alumni/*")
  async proxyAlumni(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, "alumni-service");
  }

  @All("calendar/*")
  @UseGuards(AuthGuard)
  async proxyCalendar(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, "calendar-service");
  }

  @All("payments/*")
  @UseGuards(AuthGuard)
  async proxyPayments(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, "payment-service");
  }

  @All("notifications/*")
  @UseGuards(AuthGuard)
  async proxyNotifications(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, "notification-service");
  }
}
