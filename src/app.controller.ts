import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: "Get Hello World",
    description: "Returns a hello world message",
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
