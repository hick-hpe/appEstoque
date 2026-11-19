import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // permitir somente propriedades declaradas no DTO
      forbidNonWhitelisted: true, // em vez de remover campos extras, retorna erro
      transform: true, // converte dados para os tipos definidos, quando possível
    }),
  );

  // configuração da documentação do Swagger API
  const config = new DocumentBuilder()
    .setTitle('API de Estoque')
    .setDescription('API para gerenciamento de produtos e movimentações')
    .setVersion('1.0')
    .build();

  // Disponibiliza a interface em http://localhost:3000/api
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();