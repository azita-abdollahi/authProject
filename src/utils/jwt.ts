import jwt, { SignOptions } from 'jsonwebtoken';
import conf from 'config';
import { config } from "dotenv";
config();
import fs from 'fs'

export const signJwt = (payload: Object, options: SignOptions = {}) => {
  const privateKey = fs.readFileSync('./private.key', 'utf-8');
  const token = jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256'
  });
  return `Bearer ${token}`
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const publicKey = fs.readFileSync('./public.key', 'utf-8');
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};