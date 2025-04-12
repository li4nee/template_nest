import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SharedModule } from "src/shared/shared.module";
import { RepoModule } from "src/repo/repo.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[SharedModule,RepoModule],
})
export class AuthModule {}
