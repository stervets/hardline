import jwt from 'jsonwebtoken';
import { config } from './config';

export function signToken(payload: { userId: string; ext: string }) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' });
}
