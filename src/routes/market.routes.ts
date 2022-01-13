import express from 'express';

import validationMiddleware from '../middlewares/validation.middleware';
import {
  createMarketSchema,
  getMarketSchema,
  updateMarketSchema,
  deleteMarketSchema,
} from './../schemas/market.schema';
import marketCtrl from './../controllers/market.controller';
import requireSignin from '../middlewares/requireSignin';
import marketAuthorization from '../middlewares/authorization/market.authorization';

const router = express.Router();

router
  .route('/')
  .post([requireSignin, validationMiddleware(createMarketSchema)], marketCtrl.create)
  .get(marketCtrl.list);

router
  .route('/:marketId')
  .get(validationMiddleware(getMarketSchema), marketCtrl.read)
  .patch(
    [requireSignin, marketAuthorization.isMarketOwner, validationMiddleware(updateMarketSchema)],
    marketCtrl.update,
  )
  .delete([requireSignin, marketAuthorization.isMarketOwner, validationMiddleware(deleteMarketSchema)], marketCtrl.remove);

router.param('marketId', (validationMiddleware(getMarketSchema), marketCtrl.marketByID));

export default router;
