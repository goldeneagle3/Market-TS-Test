import mongoose from 'mongoose';
import config from 'config';

import logger from './logger';


async function connect() {
  const dbUri = config.get<string>('dbUri');

  try {
    await mongoose.connect(dbUri);
    logger.info("connected to DB")
  } catch (error) {
    logger.error('Not connected');
    process.exit();
  }
}

export default connect;
