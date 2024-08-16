import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ZoomService {
  generateToken(apiKey: string, apiSecret: string): string {
    const payload = {
      iss: apiKey,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
    };
    return jwt.sign(payload, apiSecret);
  }
}
