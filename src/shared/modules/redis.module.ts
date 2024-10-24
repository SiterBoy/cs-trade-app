import Redis from 'ioredis';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentVariables } from "../interfaces/environment-variables.interface";

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService<IEnvironmentVariables>): Promise<Redis> => {
        const redis = new Redis({
          host: configService.getOrThrow<string>('REDIS_URL'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
          db: configService.getOrThrow<number>('REDIS_DB'),
          username: configService.get<string>('REDIS_LOGIN'),
          password: configService.get<string>('REDIS_PASSWORD'),
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}