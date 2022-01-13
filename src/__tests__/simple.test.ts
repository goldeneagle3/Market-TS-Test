import request from 'supertest';

import createServer from '../utils/server';

const app = createServer();

describe('check Route', () => {
  it('check test route', async () => {
    await request(app).get('/').expect(200);
  });
});
