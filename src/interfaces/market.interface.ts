import { Document } from "mongoose";
import User from "./user.interface";

interface Market extends Document {
  createdBy: User["_id"]
  title: string,
  price:number,
  location:string
}

export default Market