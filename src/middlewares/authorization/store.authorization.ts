import { NextFunction, Request, Response } from 'express';
import HttpException from '../../utils/httpException';

const isStoreOwner = (req:Request,res:Response,next:NextFunction):Response | void => {
  try {
    const {_id:userId} = res.locals.user
    
    const store = res.locals.store

    if (!userId || !store) {
      return next(new HttpException(403, 'Forbidden!'));
    }

    console.log(userId !== String(store.createdBy))

    if(userId !== String(store.createdBy) ){
      return next(new HttpException(403, 'Forbidden!'));
    }

    return next()
    
  } catch (error) {
    return next(new HttpException(403, 'Forbidden!'));
  }
}


export default {isStoreOwner}