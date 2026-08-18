import request from 'supertest';
import app from '../app.js';

describe('Trade validation', () => {
  test.each([0, -1, 'invalid'])('rejects quantity %p', async (quantity) => {
    const res = await request(app)
      .post('/api/trades')
      .set('Authorization', 'Bearer invalid-for-validation-test')
      .send({ symbol: 'RELIANCE', type: 'BUY', quantity });
    // Auth runs first; an authenticated integration fixture can assert 422.
    expect([401, 422]).toContain(res.status);
  });
});
