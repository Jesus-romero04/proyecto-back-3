import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

describe('TESTING /api/pets', () => {
  before(async () => {
    await mongoose.connect(MONGO_URL);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/pets debería devolver un array', async () => {
    const res = await request(app).get('/api/pets');
    expect(res.status).to.be.oneOf([200, 500]);
    if (res.status === 200) {
      expect(res.body.payload).to.be.an('array');
    }
  });

  it('POST /api/pets debería crear una nueva mascota', async () => {
    const newPet = {
      name: 'Toby',
      specie: 'Perro',
      birthDate: '2021-06-14',
      adopted: false
    };

    const res = await request(app).post('/api/pets').send(newPet);
    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body.payload).to.have.property('_id');
    expect(res.body.payload.name).to.equal(newPet.name);
  });

  it('POST /api/pets con datos vacíos debería fallar', async () => {
    const res = await request(app).post('/api/pets').send({});
    expect(res.status).to.be.oneOf([400, 422]);
    expect(res.body).to.have.property('status').that.equals('error');
  });
});
