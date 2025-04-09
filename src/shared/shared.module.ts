import { Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { LoginGlobalStore } from './store/login.store';
import { Logger } from './services/logger.service';
import { Mailer } from './services/mailer.service';

@Module({
  providers: [Logger,RedisService, LoginGlobalStore,Mailer],
  exports: [Logger,RedisService, LoginGlobalStore,Mailer],
})
export class SharedModule {}
