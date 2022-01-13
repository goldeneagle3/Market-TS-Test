import request from 'supertest';
import mongoose from 'mongoose';

import { connect, disconnect, clearDB } from './db';
import createServer from '../utils/server';
import MarketService from '../services/market.service';
import storeService from '../services/store.service';
import { signJwt } from '../utils/jwthandler';

// Setup Test Server and DB

const app = createServer();

beforeAll(async () => await connect());

afterEach(async () => await clearDB());

afterAll(async () => await disconnect());

const userId = new mongoose.Types.ObjectId().toString();
const userId2 = new mongoose.Types.ObjectId().toString();
const userId3 = new mongoose.Types.ObjectId().toString();

export const marketPayload = {
  createdBy: userId,
  title: 'Carrefour',
  price: 879.99,
  location: 'Basaksehir/Istanbul',
};

export const userPayload = {
  _id: userId,
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
};

export const storePayload = {
  brand: 'Zara',
  year: 2001,
  category: 'Clothes',
  createdBy: userId,
};

describe('store', () => {
  describe('POST new store', () => {
    it('create with marketId not found', async () => {
      const marketId = new mongoose.Types.ObjectId().toString();
      const { statusCode } = await request(app).post(`/api/v1/stores/${marketId}`).send(storePayload);

      expect(statusCode).toBe(404);
    });

    it('create with 401 Unauthorized Error', async () => {
      const market = await MarketService.create(marketPayload);
      const { statusCode } = await request(app).post(`/api/v1/stores/${market._id}`).send(storePayload);

      expect(statusCode).toBe(401);
    });

    it('create with store field missing', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create(marketPayload);
      const { statusCode } = await request(app)
        .post(`/api/v1/stores/${market._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...storePayload, brand: '' });

      expect(statusCode).toBe(400);
    });

    it('create store with success', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create(marketPayload);
      const { statusCode, body } = await request(app)
        .post(`/api/v1/stores/${market._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(storePayload);

      expect(statusCode).toBe(201);
      expect(body).toBeTruthy();
      // expect(body.market).toBe(market._id)
    });
  });

  describe('GET a store', () => {
    it('404 not found', async () => {
      const market = await MarketService.create(marketPayload);
      const newBody = { ...storePayload, market: market._id };
      await storeService.createStore(newBody);

      const { statusCode, body } = await request(app).get(`/api/v1/stores/${'214124214'}`);

      expect(statusCode).toBe(404);
      expect(body.brand).toEqual(undefined);
    });

    it('fetch a store successfull', async () => {
      const market = await MarketService.create(marketPayload);
      const newBody = { ...storePayload, market: market._id };
      const newStore = await storeService.createStore(newBody);

      const { statusCode, body } = await request(app).get(`/api/v1/stores/${newStore._id}`);

      expect(statusCode).toBe(200);
      expect(body.brand).toEqual(storePayload.brand);
    });
  });

  describe('GET list store', () => {
    it('fetch store with 404 error', async () => {
      const { statusCode } = await request(app).get(`/api/v1/stores/all/${'marketId'}`);

      expect(statusCode).toBe(404);
    });

    it('fetch no store without error', async () => {
      const market = await MarketService.create(marketPayload);
      const { statusCode, body } = await request(app).get(`/api/v1/stores/all/${market._id}`);

      expect(statusCode).toBe(200);
      expect(body.length).toBe(0);
    });

    it('fetch stores successfull', async () => {
      const market = await MarketService.create(marketPayload);
      const bodyOne = { ...storePayload, brand: 'LCW', market: market._id };
      const bodyTwo = { ...storePayload, market: market._id };
      await storeService.createStore(bodyOne);
      await storeService.createStore(bodyTwo);

      const { statusCode, body } = await request(app).get(`/api/v1/stores/all/${market._id}`);

      expect(statusCode).toBe(200);
      expect(body.length).toBe(2);
    });
  });

  describe('PATCH update store', () => {
    it('update with 404 not found store', async () => {
      const market = await MarketService.create(marketPayload);
      const newBody = { ...storePayload, market: market._id };
      await storeService.createStore(newBody);

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/stores/${'gibberish'}`)
        .send({ ...storePayload, year: ++storePayload.year });

      expect(statusCode).toBe(404);
      expect(body.year).toEqual(undefined);
    });

    it('update with 401 NotAuthorised Error', async () => {
      const market = await MarketService.create(marketPayload);
      const newBody = { ...storePayload, market: market._id };
      const newStore = await storeService.createStore(newBody);

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/stores/${newStore._id}`)
        .send({ ...storePayload, year: ++storePayload.year });

      expect(statusCode).toBe(401);
      expect(body.year).toEqual(undefined);
    });

    it('update with validator error', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create(marketPayload);
      const newBody = { ...storePayload, market: market._id };
      const newStore = await storeService.createStore(newBody);

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/stores/${newStore._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...storePayload, year: 1750 });

      expect(statusCode).toBe(400);
      expect(body.year).toEqual(undefined);
    });

    it('update with success', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create(marketPayload);
      const newBody = { ...storePayload, market: market._id };
      const newStore = await storeService.createStore(newBody);

      const { statusCode, body } = await request(app)
        .patch(`/api/v1/stores/${newStore._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...storePayload, year: storePayload.year + 1 });

      expect(statusCode).toBe(200);
      expect(body.year).toEqual(2004);
    });
  });

  describe('DELETE', () => {
    it('404 not found store', async () => {
      const market = await MarketService.create(marketPayload);
      const newBody = { ...storePayload, market: market._id };
      await storeService.createStore(newBody);

      const { statusCode, body } = await request(app).delete(`/api/v1/stores/${'gibberish'}`);

      expect(statusCode).toBe(404);
      expect(body.year).toEqual(undefined);
    });

    it('delete with success', async () => {
      const token = signJwt(userPayload);
      const market = await MarketService.create(marketPayload);
      const newBody = { ...storePayload, market: market._id };
      const newStore = await storeService.createStore(newBody);

      const { statusCode, body } = await request(app)
        .delete(`/api/v1/stores/${newStore._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body.year).toEqual(2003);
    });
  });
});
