import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

const testUser = {
  email: `jose${Date.now()}@test.com`,
  password: '555888',
  first_name: 'Jose',
  last_name: 'Test'
};

describe('🧪 TESTING /api/sessions', () => {
  before(async () => {
    await mongoose.connect(MONGO_URL);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('POST /api/sessions/register debe registrar un nuevo usuario', async () => {
    const res = await request(app).post('/api/sessions/register').send(testUser);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
  });

  it('POST /api/sessions/register con datos vacíos debe fallar', async () => {
    const res = await request(app).post('/api/sessions/register').send({});
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
    expect(res.body).to.have.property('error');
  });

  it('POST /api/sessions/login debe loguear al usuario', async () => {
    const res = await request(app).post('/api/sessions/login').send({
      email: testUser.email,
      password: testUser.password
    });

    console.log('LOGIN RESPONSE:', res.body);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.equal('Logged in'); 
  });

  it('POST /api/sessions/login con datos incorrectos debe fallar', async () => {
    const res = await request(app).post('/api/sessions/login').send({
      email: 'correo@inexistente.com',
      password: 'invalida'
    });
    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
  });
});
