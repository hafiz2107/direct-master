import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private defaultApp: any;
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: this.configService.get('FB_PROJECT_ID'),
        privateKey: this.configService.get('FB_PRIVATE_KEY'),
        clientEmail: this.configService.get('FB_CLIENT_EMAIL'),
      }),
    });
  }

  async validate(token: string) {
    try {
      const firebaseUser: any = await this.defaultApp
        .auth()
        .verifyIdToken(token, true)
        .catch((err) => {
          console.log(err);
          throw new UnauthorizedException(err.message);
        });
      if (!firebaseUser) {
        throw new UnauthorizedException();
      }
      return firebaseUser;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
