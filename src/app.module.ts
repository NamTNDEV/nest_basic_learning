import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './config/env.config';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './routes/posts/posts.module';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [PostsModule, SharedModule, EnvConfigModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
