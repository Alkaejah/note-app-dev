# Install cli globally `pnpm i -g @nestjs/cli`

# Create new nest project `nest new project-name`

# Create .env for env keys

## Local `MONGO_URI=mongodb://localhost:27017/note-app`

## Live `MONGO_URI=your-live-mongodb-connection-string`

# Install mongoose and config `pnpm i mongoose @nestjs/mongoose @nestjs/config --save`

## Configure database connection in `app.module.ts`

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
imports: [
ConfigModule.forRoot({
envFilePath: '.env',
isGlobal: true,
}),
MongooseModule.forRoot(process.env.MONGO_URI!),
],
controllers: [AppController],
providers: [AppService],
})
export class AppModule {}

# Start the project in dev mode `pnpm run start:dev`

# Create a module `nest g module module-name`

# Create a controller `nest g controller controller-name`

# Create a service `nest g service service-name`

# Install Validations `pnpm i class-validator class-transformer @nestjs/mapped-types`
