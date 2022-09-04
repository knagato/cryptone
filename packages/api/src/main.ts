import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3030);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
