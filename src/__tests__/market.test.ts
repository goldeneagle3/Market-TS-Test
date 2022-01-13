import request from 'supertest';
import mongoose from 'mongoose';

import { connect, disconnect, clearDB } from './db';
import createServer from '../utils/server';
import MarketService from '../services/market.service';
import { signJwt } from '../utils/jwthandler';

// Setup Test Server and DB

const app = createServer();

beforeAll(async () => await connect());

afterEach(async () => await clearDB());

afterAll(async () => await disconnect());

// Testing payloads

const userId = new mongoose.Types.ObjectId().toString();
const userId2 = new mongoose.Types.ObjectId().toString();

export const userPayload = {
  _id: userId,
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
};

export const marketPayload = {
  createdBy: userId,
  title: 'Carrefour',
  price: 879.99,
  location: 'Basaksehir/Istanbul',
};

describe('market', () => {
  describe('POST new market', () => {
    it('create market with error', async () => {
      const { statusCode } = await request(app).post('/api/v1/markets').send(marketPayload);

      expect(statusCode).toBe(401);
    });
    it('POST market successfull', async () => {
      const token = signJwt(userPayload);
      const { statusCode } = await request(app)
        .post('/api/v1/markets')
        .set('Authorization', `Bearer ${token}`)
        .send(marketPayload);

      expect(statusCode).toBe(201);
    });
  });

  describe('GET list markets', () => {
    it('markets errors', async () => {
      const { statusCode } = await request(app).get('/api/v1/market');

      expect(statusCode).toBe(404);
      // expect(body).toBeTruthy();
    });

    it('markets succesfull', async () => {
      await MarketService.create(marketPayload);
      await MarketService.create({ ...marketPayload, price: 21412 });
      await MarketService.create({ ...marketPayload, location: 'Bagcılar/Istanbul' });

      const { statusCode, body } = await request(app).get('/api/v1/markets');

      expect(statusCode).toBe(200);
      expect(body).toBeTruthy();
      expect(body.length).toEqual(3);
    });
  });

  describe('GET fetch a market', () => {
    it('single market with errors', async () => {
      const { statusCode } = await request(app).get(`/api/v1/markets/2312`);

      expect(statusCode).toBe(404);
    });

    it('markets succesfull', async () => {
      const market = await MarketService.create(marketPayload);
      const { statusCode, body } = await request(app).get(`/api/v1/markets/${market._id}`);

      expect(statusCode).toBe(200);
      expect(body).toBeTruthy();
      expect(body.title).toEqual('Carrefour');
    });
  });

  describe('PATCH update a market', () => {
    it('update market successfully', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create(marketPayload);

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/markets/${market._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...marketPayload, title: 'Migros' });

      console.log(body);
      expect(statusCode).toBe(200);
      expect(body).toBeTruthy();
      expect(body.title).toEqual('Migros');
    });

    it('update market with not found', async () => {
      await MarketService.create(marketPayload);

      const { statusCode } = await request(app)
        .patch(`/api/v1/market/eefadqeeq2q2`)
        .send({ ...marketPayload, title: 'Migros' });

      expect(statusCode).toBe(404);
    });

    it('update market with validation error', async () => {
      const market = await MarketService.create(marketPayload);

      const { statusCode } = await request(app)
        .patch(`/api/v1/markets/${market._id}`)
        .send({ ...marketPayload, title: '' });

      expect(statusCode).toBe(401);
    });

    it('update market with 401 Unauthorized error', async () => {
      const market = await MarketService.create(marketPayload);

      const { statusCode } = await request(app).patch(`/api/v1/markets/${market._id}`).send(marketPayload);

      expect(statusCode).toBe(401);
    });

    it('update market with 403 Forbidden error', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create({ ...marketPayload, createdBy: userId2 });

      const { statusCode } = await request(app)
        .patch(`/api/v1/markets/${market._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(marketPayload);

      expect(statusCode).toBe(403);
    });
  });

  describe('DELETE a market', () => {
    it('delete market successfully', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create(marketPayload);

      const { statusCode, body } = await request(app)
        .delete(`/api/v1/markets/${market._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toBeTruthy();
      expect(body.title).toEqual(marketPayload.title);
    });
    
    it('delete market with 403 Forbidden Error', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create({...marketPayload,createdBy:userId2});

      const { statusCode } = await request(app)
        .delete(`/api/v1/markets/${market._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(403);
    });
    
    it('delete market with 403 Unauthorized Error', async () => {
      const market = await MarketService.create({...marketPayload,createdBy:userId2});

      const { statusCode } = await request(app)
        .delete(`/api/v1/markets/${market._id}`)

      expect(statusCode).toBe(401);
    });

    it('delete market with 404 Not Found Error', async () => {
      await MarketService.create(marketPayload);

      const { statusCode } = await request(app)
        .delete(`/api/v1/market/eefadqeeq2q2`)
        .send({ ...marketPayload, title: 'Migros' });

      expect(statusCode).toBe(404);
    });
  });
});
