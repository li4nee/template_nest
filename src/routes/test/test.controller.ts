import { Controller, Get, HttpCode, Redirect } from "@nestjs/common";
import { Request } from "express";
import { globalSettings } from "src/config/settings.config";
import { Mailer } from "src/shared/services/mailer.service";
import { TestError } from "src/types/error.type";

@Controller("test")
export class TestController {
  constructor(
    private readonly mailer:Mailer
  ){}
  
@Get("/")
async getTestMail(req: Request) {

}

}
