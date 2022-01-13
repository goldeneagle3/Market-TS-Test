import jwt from 'jsonwebtoken';
import config from 'config';
// import mongoose from 'mongoose';
// import User from '../interfaces/user.interface';

const secret = config.get<string>('privateKey');

// eslint-disable-next-line @typescript-eslint/ban-types
export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, secret, {
    ...(options && options)
  });
}

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
};
