import { NextFunction, Request, Response } from 'express';
import storeService from '../services/store.service';
import HttpException from '../utils/httpException';

const create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const market = res.locals.market
  if (!market) {
    next(new HttpException(404, 'Market could not be find!'));
  }

  const {_id:userId} = res.locals.user
  // eslint-disable-next-line prefer-const
  let body = req.body
  body.market = market._id
  body.createdBy = userId
  
  try {
    const store = await storeService.createStore(body)
    res.status(201).json(store)
    
  } catch (error) {
    next(new HttpException(400, 'Store could not be created!'));
  }
};

const storeByID = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const {storeId} = req.params
    const store = await storeService.findOne(storeId);
    res.locals.store = store;
    next();
  } catch (error) {
    next(new HttpException(404, 'Store could not found!'));
  }
}

const read = (req: Request, res: Response): void => {
  const store = res.locals.store
  res.status(200).json(store);
};

const list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const market = res.locals.market
  if (!market) {
    next(new HttpException(404, 'Market could not be find!'));
  }
  try {
    const stores = await storeService.findStores(market._id)
    res.status(200).json(stores)
    
  } catch (error) {
    next(new HttpException(400, 'Stores could not be uploaded!'));
  }
}

const update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const store = res.locals.store
  if (!store) {
    next(new HttpException(404, 'Store could not be find!'));
  }
  const updateBody = req.body
  try {
    const updatedStore = await storeService.updateOne(store._id,updateBody,{
      new:true,
      runValidators:true
    })
    res.status(200).json(updatedStore)

  } catch (error) {
    next(new HttpException(400, 'Store could not be updated!'));
  }
}

const remove = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const store = res.locals.store
  if (!store) {
    next(new HttpException(404, 'Store could not be find!'));
  }
  try {
    const deletedStore = await storeService.deleteOne(store._id)
    res.status(200).json(deletedStore)

  } catch (error) {
    next(new HttpException(400, 'Store could not be deleted!'));
  }
}

export default {create,storeByID,read,list,update,remove}