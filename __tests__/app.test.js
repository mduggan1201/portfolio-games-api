const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const app = require('../app')
const request = require('supertest')

beforeEach(() => {
    return seed(testData)
  });
  
  afterAll(() => { 
    db.end()
  });
  
  describe('GET /api/categories', () => {
    it('responds with object with key of category and array of objects showing slug and description', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then((res) => {
            expect(res.body.category.length).toBe(4);
            expect(Object.keys(res.body.category[0])).toEqual(['slug', 'description'])
          });
    })
  });
  
  describe('Invalid PATH - Get /api/banana', () => {
    it('responds with an error message denoting an invalid path', () => {
        return request(app)
        .get('/api/banana')
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({"msg": "Invalid Path"})
          });
    })
  });