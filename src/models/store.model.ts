import mongoose, { Schema, model } from 'mongoose';

import IStore from '../interfaces/store.interface';

const StoreSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Market',
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  { timestamps: true },
);

export default model<IStore>('Store', StoreSchema);
