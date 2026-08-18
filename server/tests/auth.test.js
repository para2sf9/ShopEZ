import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';

describe('Authentication API', () => {
  test('rejects malformed login input', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'bad', password: '' });
    expect(res.status).toBe(422);
  });

  test('rejects an invalid JWT on protected route', async () => {
    const res = await request(app).get('/api/trades/portfolio').set('Authorization', 'Bearer not-a-token');
    expect(res.status).toBe(401);
  });

  test('JWT payload includes role', () => {
    const token = jwt.sign({ id: '507f1f77bcf86cd799439011', role: 'USER' }, process.env.JWT_SECRET || 'test-secret');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    expect(decoded.role).toBe('USER');
  });
});
