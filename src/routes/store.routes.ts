import express from 'express';

import validationMiddleware from '../middlewares/validation.middleware';
import {
  createStoreSchema,
  deleteStoreSchema,
  getStoreSchema,
  listStoreSchema,
  updateStoreSchema,
} from './../schemas/store.schema';
import storeCtrl from './../controllers/store.controller';
import marketCtrl from '../controllers/market.controller';
import { getMarketSchema } from '../schemas/market.schema';
import requireSignin from '../middlewares/requireSignin';
import storeAuthorization from '../middlewares/authorization/store.authorization';

const router = express.Router();

router.route('/:marketId').post([requireSignin, validationMiddleware(createStoreSchema)], storeCtrl.create);

router.route('/all/:marketId').get(validationMiddleware(listStoreSchema), storeCtrl.list);

router
  .route('/:storeId')
  .get(validationMiddleware(getStoreSchema), storeCtrl.read)
  .patch([requireSignin, storeAuthorization.isStoreOwner, validationMiddleware(updateStoreSchema)], storeCtrl.update)
  .delete([requireSignin, storeAuthorization.isStoreOwner, validationMiddleware(deleteStoreSchema)], storeCtrl.remove);

router.param('marketId', (validationMiddleware(getMarketSchema), marketCtrl.marketByID));
router.param('storeId', (validationMiddleware(getStoreSchema), storeCtrl.storeByID));

export default router;
