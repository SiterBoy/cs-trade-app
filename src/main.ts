import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from "./shared/configs/swagger.config";
import { ConfigService } from "@nestjs/config";
import { IEnvironmentVariables } from "./shared/interfaces/environment-variables.interface";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  setupSwagger(app);

  const configService = app.get<ConfigService<IEnvironmentVariables>>(ConfigService);
  const appPort = configService.getOrThrow('APP_PORT');

  await app.listen(appPort);
}
bootstrap();
