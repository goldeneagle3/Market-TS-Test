import mongoose, { Schema, model } from 'mongoose';

import IMarket from './../interfaces/market.interface';

const MarketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true },
);

export default model<IMarket>('Market', MarketSchema);
