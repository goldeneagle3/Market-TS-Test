import { QueryOptions } from "mongoose";
import storeModel from "../models/store.model";



const createStore =async (payload:{brand:string,year:number,market:string,category:string,createdBy:string}) => {
  try {
    const store = await storeModel.create(payload)
    return store
  } catch (error) {
    throw new Error("Could not create store");
        
  }
}

const findOne = async (storeId: string) => {
  try {
    const store = await storeModel.findById(storeId);
    if (!store) {
      throw new Error('Store not found!');
    }
    return store;
  } catch (error) {
    throw new Error('Server Error');
  }
};

const findStores = async (marketId: string) => {
  try {
    const store = await storeModel.find({market:marketId});
    if (!store) {
      throw new Error('Stores not found!');
    }
    return store;
  } catch (error) {
    throw new Error('Server Error');
  }
};


const updateOne = async (storeId:string,payload:{brand:string,year:number,category:string}, options: QueryOptions) => {
  try {
    const store = await storeModel.findByIdAndUpdate(storeId,payload,options)
    return store
  } catch (error) {
    throw new Error("Could ot update");
  }
}

const deleteOne = async (storeId:string) => {
  return storeModel.findByIdAndDelete(storeId);
};


export default {
  createStore,
  findOne,
  findStores,
  updateOne,
  deleteOne
}