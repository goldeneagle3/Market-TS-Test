import {  Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import HttpException from '../utils/httpException';



const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {

      await userService.register(req.body);

      res.status(201).json({message:"Congrutulations!"});
  } catch (error:any) {
      next(new HttpException(400, error.message));
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const {email,password} = req.body

      const token = await userService.signin(email,password);

      res.status(200).json(token);
  } catch (error:any) {
      next(new HttpException(400, "Wrong credentials"));
  }
};



export default {
  create,
  login
}