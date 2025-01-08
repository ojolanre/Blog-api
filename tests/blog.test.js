 // __tests__/blog.test.js
 const request = require('supertest');
 const express = require('express')
 const app = require('../index'); // assuming your express app instance is exported
 const mongoose = require('mongoose');
 const User = require('../src/models/userModel')
 const Blog = require('../src/models/blogModel')
 const dotenv = require('dotenv')
 dotenv.config()
 
 let authToken;
 let userId;
 let server;
 
  beforeAll(async () => {
     await mongoose.connect(process.env.MONGODB_URI, {
             useNewUrlParser: true,
             useUnifiedTopology: true,
          });
          server = express()
     server = app.listen(3001)
 
   // create user and get token to be used in tests
     const response = await request(server)
        .post('/auth/signup')
         .send({
              first_name: 'Test',
              last_name: 'User',
             email: 'testblog@example.com',
              password: 'password123',
         });
   const login = await request(server)
     .post('/auth/signin')
         .send({
             email: 'testblog@example.com',
               password: 'password123',
            });
    authToken = login.headers['set-cookie'][0].split('=')[1]
    const user = await User.findOne({ email: 'testblog@example.com'});
     userId = user._id
     });
  afterAll(async () => {
     await mongoose.connection.close();
      server.close()
     });
 
 describe('Blog Endpoints', () => {
       it('should create a new blog post with valid token', async () => {
         const response = await request(server)
             .post('/blogs')
              .set('Cookie', `token=${authToken}`)
               .send({
                  title: 'Test Blog Post',
                  description: 'This is a test blog post.',
                  body: 'This is the body of the blog post.',
               });
              expect(response.statusCode).toBe(201);
            expect(response.headers['set-cookie']).toBeDefined()
           });
          it('should return an error when creating blog post with no token', async () => {
            const response = await request(server)
              .post('/blogs')
               .send({
                  title: 'Test Blog Post',
                   description: 'This is a test blog post.',
                    body: 'This is the body of the blog post.',
              });
              expect(response.statusCode).toBe(401);
             expect(response.body).toEqual({ message: 'Authorization failed' });
          });
          it('should return an error when creating blog post with invalid token', async () => {
            const response = await request(server)
              .post('/blogs')
               .set('Cookie', 'token=invalidtoken')
                 .send({
                      title: 'Test Blog Post',
                      description: 'This is a test blog post.',
                     body: 'This is the body of the blog post.',
                   });
                expect(response.statusCode).toBe(401);
                expect(response.body).toHaveProperty('message')
          });
           it('should get published blogs', async () => {
              const response = await request(server)
                  .get('/blogs')
              expect(response.statusCode).toBe(200);
               expect(response.text).toContain('Published Blog Posts')
           });
         it('should get user blogs with valid token', async () => {
             const response = await request(server)
               .get('/blogs/user')
               .set('Cookie', `token=${authToken}`)
             expect(response.statusCode).toBe(200);
               expect(response.text).toContain('My Blog Posts')
        })
 
       it('should return error when getting user blogs with no token', async () => {
                const response = await request(server)
                    .get('/blogs/user')
                  expect(response.statusCode).toBe(401);
                  expect(response.body).toEqual({message: "Authorization failed"})
 
        })
         it('should get a single blog post', async () => {
           const blogCreationResponse = await request(server)
                .post('/blogs')
                 .set('Cookie', `token=${authToken}`)
                  .send({
                       title: 'Test Blog Post',
                      description: 'This is a test blog post.',
                     body: 'This is the body of the blog post.',
                    });
             const blogId = blogCreationResponse.body._id
              const response = await request(server)
                   .get(`/blogs/${blogId}`)
                 expect(response.statusCode).toBe(200);
                expect(response.text).toContain("Test Blog Post")
            })
     });