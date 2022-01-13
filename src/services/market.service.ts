import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import Market from '../interfaces/market.interface';
import marketModel from '../models/market.model';

const create = async (payload: { title: string; price: number; location: string,createdBy:string }): Promise<Market> => {
  try {
    const market = await marketModel.create(payload);

    return market;
  } catch (error) {
    throw new Error('Unable to create market');
  }
};

const listAll = async () => {
  try {
    const markets = await marketModel.find();

    return markets;
  } catch (error) {
    throw new Error('Unable to find markets');
  }
};

const findOne = async (marketId: string) => {
  try {
    const market = await marketModel.findById(marketId);
    if (!market) {
      throw new Error('Market not found!');
    }
    return market;
  } catch (error) {
    throw new Error('Server Error');
  }
};

const updateOne = async (query: FilterQuery<Market>, update: UpdateQuery<Market>, options: QueryOptions) => {
  return marketModel.findOneAndUpdate(query, update, options);
};

const deleteOne = async (query:{_id:string}) => {
  return marketModel.findOneAndUpdate(query);
};

export default { create, listAll, findOne, updateOne,deleteOne };
