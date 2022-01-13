import request from 'supertest';

import { connect, disconnect, clearDB } from './db';
import createServer from '../utils/server';
import userService from '../services/user.service';


const app = createServer();

beforeAll(async () => await connect());

afterEach(async () => await clearDB());

afterAll(async () => await disconnect());

const userInput = {
  name: "Jane Doe",
  email: "test@example.com",
  password: "Password123",
  passwordConfirmation: "Password123",
};

const userPayload = {
  name: "Jane Doe",
  email: "test@example.com",
  password: "Password123",
  passwordConfirmation: "Password123",
  role:'user'
};

const userLogin = {
  email: "test@example.com",
  password: "Password123"
}

describe('User', () => {
  describe('POST register user', () => {
    it('register with success',async () => {
      const {statusCode,body} = await request(app).post("/api/v1/users").send(userInput)

      expect(body.message).toEqual('Congrutulations!')
      expect(statusCode).toBe(201)
    })

    it('register with error',async () => {
      const {statusCode,body} = await request(app).post("/api/v1/users").send({...userInput,password:'12412'})

      expect(body.message).toEqual(undefined)
      expect(statusCode).toBe(400)
    })
  })
  
  describe('POST signin user', () => {
    it("login with error",async () => {
      await userService.register({...userPayload,email:'test2@example.com'})
      const {statusCode} = await request(app).post("/api/v1/users/login").send({...userLogin,email:'test3@example.com'})

      expect(statusCode).toBe(400)
    })
    
    it("login with success",async () => {
      await userService.register({...userPayload,email:'test2@example.com'})
      const {statusCode} = await request(app).post("/api/v1/users/login").send({...userLogin,email:'test2@example.com'})

      expect(statusCode).toBe(200)
    })
  })
  
})
