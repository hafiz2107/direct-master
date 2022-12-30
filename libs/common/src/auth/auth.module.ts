import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
// import * as cookieParser from 'cookie-parser';
import { RmqModule } from '../rmq/rmq.module';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  exports: [RmqModule, PassportModule],
  providers: [FirebaseAuthStrategy],
})
export class AuthModule {}
