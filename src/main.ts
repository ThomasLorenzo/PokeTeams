import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global dos DTOs (remove campos extras e faz transformações)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Gera a documentação da API e disponibiliza em /docs
  const config = new DocumentBuilder()
    .setTitle('PokeTeams API')
    .setDescription('API para gerenciar treinadores, times e Pokémon integrando com a PokéAPI')
    .setVersion('1.0')
    .build()
  const swaggerDoc = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, swaggerDoc);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();