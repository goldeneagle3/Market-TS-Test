import { Document } from "mongoose";
import Market from "./market.interface";
import User from "./user.interface";

interface Store extends Document {
  market: Market["_id"]
  brand: string,
  year:number,
  category:string,
  createdBy:User["_id"]
}

export default Store