import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppDataSource } from "./config/db.config";
import { Logger } from "./shared/services/logger.service";
import { globalSettings } from "./config/settings.config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./catch/globalErrorCatcher";
import { RateLimitMiddleware } from "./middleware/ratelimit.middleware";
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // use cookie parser middleware
  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));

  app.enableShutdownHooks(); // enable graceful shutdown

  await AppDataSource.initialize();
  console.log("Database connected");

  // check if migrations are pending
  const migrations = await AppDataSource.showMigrations();
  if (migrations) {
    await AppDataSource.runMigrations();
    console.log("Migrations ran successfully");
  }

  // use swagger for api documentation
  if(globalSettings.WORK_ENVIRONMENT!=="PRODUCTION")
  {
    const config = new DocumentBuilder()
      .setTitle("NEST JS STARTER PACKAGE")
      .setDescription("API DESCRIPTION FOR NEST JS STARTER PACKAGE")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("swagger", app, document);
  }

  // use morgan for logging
  app.use(new Logger().getMiddleware());

  // set global prefix for api routes and enable CORS
  app.enableCors({ origins: "*" });
  app.setGlobalPrefix("api/v1");

  await app.listen(globalSettings.PORT);
  console.log(`Application is running on port ${globalSettings.PORT}`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
