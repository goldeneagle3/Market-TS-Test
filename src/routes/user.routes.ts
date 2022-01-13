import express from 'express';

import validationMiddleware from '../middlewares/validation.middleware';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
import userCtrl from './../controllers/user.controller';

const router = express.Router();

router.route('/').post(validationMiddleware(createUserSchema), userCtrl.create);

router.route('/login').post(validationMiddleware(loginUserSchema), userCtrl.login);

export default router;
