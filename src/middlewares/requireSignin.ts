import { get } from "lodash";
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../utils/httpException';
import { verifyToken } from '../utils/jwthandler';

async function requireSignin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const token = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (!token) {
    return next(new HttpException(401, 'Unauthorised'));
  }

  // const token = bearer?.split('Bearer ')[1].trim();
  try {
    const {decoded,expired,valid} = verifyToken(token);


    if (decoded instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'Unauthorised'));
    }


    // const user = await userModel.findById(decoded._id).select('-password').exec();

    if (expired || !valid) {
      return next(new HttpException(401, 'Unauthorised'));
    }

    res.locals.user = decoded;

    return next();
  } catch (error) {
    return next(new HttpException(401, 'Unauthorised'));
  }
}


export default requireSignin