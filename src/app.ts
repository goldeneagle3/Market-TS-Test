import config from 'config';

import connectDB from './utils/connect';
import logger from './utils/logger';
import createServer from './utils/server';

const port = config.get<string>('port');

const app = createServer();


app.listen(port, async () => {
  logger.info(`Api is running at http://localhost:${port}`);

  await connectDB();
});