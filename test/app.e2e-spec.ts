import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should return hello world', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });

    it('should redirect to Google OAuth', () => {
      return request(app.getHttpServer())
        .get('/api/auth/google')
        .expect(302)
        .expect('Location', /accounts\.google\.com/);
    });
  });

  describe('Notes API', () => {
    describe('Without authentication', () => {
      it('should reject creating note without auth', () => {
        return request(app.getHttpServer())
          .post('/api/notes')
          .send({
            title: 'Test Note',
            content: 'Test content',
          })
          .expect(401);
      });

      it('should reject getting notes without auth', () => {
        return request(app.getHttpServer()).get('/api/notes').expect(401);
      });
    });

    // Note: Authentication tests require proper JWT token setup
    // These tests verify that endpoints are protected
  });

  describe('Users API (Admin only)', () => {
    it('should reject getting users without auth', () => {
      return request(app.getHttpServer()).get('/api/users').expect(401);
    });

    // Note: Admin authentication tests require proper JWT token setup
    // These tests verify that endpoints are protected
  });

  describe('Error handling', () => {
    it('should handle invalid routes', () => {
      return request(app.getHttpServer()).get('/invalid-route').expect(404);
    });

    it('should handle malformed JSON', () => {
      return request(app.getHttpServer())
        .post('/api/notes')
        .set('Content-Type', 'application/json')
        .send('{invalid json}')
        .expect(400);
    });
  });
});
