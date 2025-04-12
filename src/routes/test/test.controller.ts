import { Controller, Get, HttpCode, Redirect, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { LoginGuard } from "src/auth/login.guard";
import { globalSettings } from "src/config/settings.config";
import { Mailer } from "src/shared/services/mailer.service";
import { AuthorizedRequest } from "src/types/base.type";
import { TestError } from "src/types/error.type";

@Controller("test")
export class TestController {
  constructor(
    private readonly mailer:Mailer
  ){}
  
@Get("/")
@UseGuards(LoginGuard)
async getTestMail(req: AuthorizedRequest) {
  return "Hello World";
}

}
