import userModel from "../models/user.model";
import { signJwt } from "../utils/jwthandler";
import config from "config";



const register = async (payload:{name:string,email:string,password:string,passwordConfirmation:string,role:string}) => {
    try {
      const user = await userModel.create(payload)
      return user
    } catch (error:any) {
      throw new Error(error.message);
      
    }
  }

  

const signin = async (email:string,password:string) => {
    try {
      const user = await userModel.findOne({email})
      if (!user) {
        throw new Error("User not found!");
      }

      const isValidPassword = await user.isValidPassword(password)
      if(!isValidPassword){
        throw new Error("Wrong credentials");
      }

      const token = await signJwt({_id:user._id},
        { expiresIn: config.get("accessTokenTtl") })

      return token
    } catch (error:any) {
      throw new Error(error.message);
      
    }
  }




  export default {
    register,
    signin
  }