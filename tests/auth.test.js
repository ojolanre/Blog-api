// __tests__/auth.test.js
const request = require('supertest');
const express = require('express');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const dotenv = require('dotenv')
dotenv.config()

let server;
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         });
         server = express()
      server = app.listen(3001)

    });

 afterAll(async () => {
       await mongoose.connection.close();
        server.close()
     });
describe('Auth Endpoints', () => {
      it('should register a new user', async () => {
       const response = await request(server)
           .post('/auth/signup')
           .send({
             first_name: 'Test',
             last_name: 'User',
            email: 'test@example.com',
             password: 'password123',
           });
         expect(response.statusCode).toBe(200);
        expect(response.headers['set-cookie']).toBeDefined()
       });
      it('should not register a new user with existing email', async () => {
          const response = await request(server)
              .post('/auth/signup')
            .send({
                  first_name: 'Test',
                  last_name: 'User',
                 email: 'test@example.com',
                password: 'password123',
               });
            expect(response.statusCode).toBe(400);
            expect(response.text).toContain('Email already in use')
          });
       it('should login a user with valid credentials', async () => {
         const response = await request(server)
           .post('/auth/signin')
           .send({
               email: 'test@example.com',
             password: 'password123',
           });
         expect(response.statusCode).toBe(200);
          expect(response.headers['set-cookie']).toBeDefined()
         });
    it('should not login user with invalid credentials', async () => {
      const response = await request(server)
            .post('/auth/signin')
             .send({
               email: 'test@example.com',
                password: 'wrongpassword',
               });
            expect(response.statusCode).toBe(401);
          expect(response.text).toContain('Invalid credentials');
       });
});