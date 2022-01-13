import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import routes from "../routes/routes";


function createServer() {
  const app = express();

  app.use(helmet())
  app.use(cors())
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(compression())
  app.use(hpp())

  routes(app);

  return app;
}

export default createServer;