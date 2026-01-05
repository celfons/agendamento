import jwt from 'jsonwebtoken';
import { config } from '../../config/config';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtService {
  private static readonly JWT_SECRET = config.jwtSecret;
  private static readonly JWT_EXPIRES_IN = '24h';

  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
