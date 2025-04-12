import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppData } from "./config/db.config";
import { TasksModule } from "./routes/tasks/tasks.module";
import { AuthModule } from "./routes/auth/auth.module";
import { TestController } from "./routes/test/test.controller";
import { TestModule } from "./routes/test/test.module";
import { TasksService } from "./routes/tasks/tasks.service";
import { SharedModule } from "./shared/shared.module";
import { RateLimitMiddleware } from "./middleware/ratelimit.middleware";
import { RepoModule } from "./repo/repo.module";
import { User } from "./entity/user.entity";

@Module({
  imports: [
    // Yo chai database ko configuration
    TypeOrmModule.forRoot(AppData),
    // Yo chai database ko table haru ko configuration
    TypeOrmModule.forFeature([User]),
    RepoModule,
    TasksModule,
    AuthModule,
    TestModule,
    SharedModule
  ],
  providers: [AppService, TasksService],
  exports: [SharedModule],
  controllers: [AppController, TestController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware)
    .forRoutes("/")
  }
}
