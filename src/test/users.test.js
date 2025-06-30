import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

describe('TESTING /api/users y /sessions', () => {
  before(async () => {
    await mongoose.connect(MONGO_URL);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/users debería devolver un array', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload).to.be.an('array');
  });

  it('POST /api/sessions/register debería registrar un nuevo usuario', async () => {
    const newUser = {
      first_name: 'Jose',
      last_name: 'Test',
      email: `jose${Date.now()}@test.com`,
      password: '555888'
    };

    const res = await request(app).post('/api/sessions/register').send(newUser);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload).to.be.a('string'); // ID del usuario
  });

  it('POST /api/sessions/register con datos incompletos debería fallar', async () => {
    const res = await request(app).post('/api/sessions/register').send({});
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
    expect(res.body).to.have.property('error');
  });
});
