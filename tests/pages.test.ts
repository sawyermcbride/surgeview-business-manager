import {jest, expect, test, describe} from '@jest/globals';
import app from '../index';
import request from 'supertest';


describe('Home and signup page tests: ', () => {
  test('should render the home page with the correct content', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);

    expect(response.text).toContain('Expand Your Reach on YouTube');
  });

  test('should render the pricing page with the correct content', async () => {
    const response = await request(app).get('/pricing');

    expect(response.status).toBe(200);

    expect(response.text).toContain('Standard');
    expect(response.text).toContain('Premium');
    expect(response.text).toContain('Pro');
  });

  test('should render the pricing page with the correct content', async () => {
    const response = await request(app).get('/pricing');

    expect(response.status).toBe(200);

    expect(response.text).toContain('Standard');
    expect(response.text).toContain('Premium');
    expect(response.text).toContain('Pro');
  });

  test('should return to homepage when visiting /signup-details with invalid plan parameter', async ()  => {
    const response = await request(app).get('/signup-details?plan=basic');

    expect(response.status).toBe(302);

    expect(response.headers['location']).toBe('/');

  })

  test('should render signup page when visiting /signup-details with plan parameter', async ()  => {
    const response = await request(app).get('/signup-details?plan=Standard');

    expect(response.status).toBe(200);

    expect(response.text).toContain('Get Started');

  })

});

 