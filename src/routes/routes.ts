import { Express, Request, Response } from 'express';

import userRoutes from './user.routes'
import storeRoutes from './store.routes'
import marketRoutes from './market.routes'

function routes(app: Express) {
  app.get("/", (req:Request, res:Response) => {
    res.send( "Hello mfuckerssss..")
  })

  app.use('/api/v1/users',userRoutes)
  app.use('/api/v1/stores',storeRoutes)
  app.use('/api/v1/markets',marketRoutes)

}

export default routes;
