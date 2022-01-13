import { NextFunction, Request, Response } from 'express';
import HttpException from '../../utils/httpException';

const isMarketOwner = (req:Request,res:Response,next:NextFunction):Response | void => {
  try {
    const {_id:userId} = res.locals.user
    
    const market = res.locals.market

    if (!userId || !market) {
      return next(new HttpException(403, 'Forbidden!'));
    }

    if(userId !== String(market.createdBy) ){
      return next(new HttpException(403, 'Forbidden!'));
    }

    return next()
    
  } catch (error) {
    return next(new HttpException(403, 'Forbidden!'));
  }
}


export default {isMarketOwner}