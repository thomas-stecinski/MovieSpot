import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Autorisation CORS
  app.enableCors({
    origin: 'http://localhost:4000', // 🔥 Autorise uniquement le frontend React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // 🔐 Si tu utilises des cookies ou sessions
  });

  // 🔹 Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API permettant de récupérer des films depuis TMDb.')
    .setVersion('1.0')
    .addBearerAuth() // 🔐 Ajout du support JWT dans Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('🚀 API disponible sur : http://localhost:3000/api');
}

bootstrap();
