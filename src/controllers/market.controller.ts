import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/httpException';
import MarketService from './../services/market.service';

const create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {

    const {_id:userId} = res.locals.user

    const body = {...req.body,userId}

    const market = await MarketService.create(body);
    res.status(201).json(market);
  } catch (error) {
    next(new HttpException(400, 'Could not create post'));
  }
};

const marketByID = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const {marketId} = req.params
    const market = await MarketService.findOne(marketId);
    res.locals.market = market;
    next();
  } catch (error) {
    next(new HttpException(404, 'Market could not found!'));
  }
};

const list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // const { title, price, location } = req.body;

    const markets = await MarketService.listAll();
    res.status(200).json(markets);
  } catch (error) {
    next(new HttpException(400, 'Could not get posts'));
  }
};

const read = (req: Request, res: Response): void => {
    const market = res.locals.market
    res.status(200).json(market);

};

const update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // const { marketId } = req.params;

    const update = req.body;
    const market = await MarketService.findOne(res.locals.market);
    if (!market) {
      return res.sendStatus(404);
    }

    const updatedProduct = await MarketService.updateOne({ _id: res.locals.market }, update, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(new HttpException(400, 'Market could not be updated!'));
  }
};

const remove = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // const { marketId } = req.params;
    const market = await MarketService.findOne(res.locals.market);
    if (!market) {
      return res.sendStatus(404);
    }

    const deletedMarket = await MarketService.deleteOne({ _id: res.locals.market });

    res.status(200).json(deletedMarket);
  } catch (error) {
    next(new HttpException(400, 'Market could not be deleted!'));
  }
};

export default { create, list, read, update, remove, marketByID };
