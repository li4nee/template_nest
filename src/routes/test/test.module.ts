import { Module } from "@nestjs/common";
import { TestController } from "./test.controller";
import { Mailer } from "src/shared/services/mailer.service";
import { SharedModule } from "src/shared/shared.module";

@Module({
    controllers: [TestController],
    imports: [SharedModule],
})
export class TestModule {

}
