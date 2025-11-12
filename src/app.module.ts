import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteModule } from './note/note.module';
import { AuthModule } from './auth/auth.module';
import { ProtectedController } from './auth/protected/protected.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    NoteModule,
    AuthModule,
  ],
  controllers: [AppController, ProtectedController, AuthController],
  providers: [AppService],
})
export class AppModule {}
