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

describe('GET /api/reviews/:review_id', () => {
    it('responds with the specified reivew and assiocated data', () => {
        return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then((res) => {
            expect(Object.keys(res.body.review)).toEqual(['review_id', 'title','category','designer','owner','review_body','review_img_url','created_at','votes'])
            expect(res.body.review["review_id"]).toBe(1)
          });
    })
  });

describe('GET /api/review/:review_id', () => {
  it('responds with an error when the review is not in the database', () => {
      return request(app)
      .get('/api/reviews/1234')
      .expect(404)
      .then((res) => {
          expect(res.body).toEqual({"msg":"No review found for review_id: 1234"})
      })
  })
})


describe('GET /api/review/:review_id', () => {
  it('responds with an error when the review is not a number', () => {
      return request(app)
      .get('/api/reviews/banana')
      .expect(400)
      .then((res) => {
          expect(res.body).toEqual({"msg":"ID entered is not a number"})
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with a review object with updated votes', () => {
    const reviewUpdates = {"inc_votes": 100}
      return request(app)
      .patch('/api/reviews/1')
      .send(reviewUpdates)
      .expect(200)
      .then((res) => {
        expect(res.body.review[0]["votes"]).toBe(101)
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with a review object with updated votes reducing votes for a negative number', () => {
    const reviewUpdates = {"inc_votes": -100}
      return request(app)
      .patch('/api/reviews/1')
      .send(reviewUpdates)
      .expect(200)
      .then((res) => {
        expect(res.body.review[0]["votes"]).toBe(-99)
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with an error when the review is not in the database', () => {
    const reviewUpdates = {"inc_votes": 100}
      return request(app)
      .patch('/api/reviews/1234')
      .send(reviewUpdates)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({"msg":"No review found for review_id: 1234. There has been no update."})
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with an error when the review is not a number', () => {
    const reviewUpdates = {"inc_votes": 100}
      return request(app)
      .patch('/api/reviews/banana')
      .send(reviewUpdates)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({"msg":"ID entered is not a number, There has been no update."})
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with an error when the incremental votes is not a number', () => {
    const reviewUpdates = {"inc_votes": "banana"}
      return request(app)
      .patch('/api/reviews/1')
      .send(reviewUpdates)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({"msg":"Incremental votes entered is not a number. There has been no update."})
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with an error when the request body is incorrect', () => {
    const reviewUpdates = {"inc votes": 100}
      return request(app)
      .patch('/api/reviews/1')
      .send(reviewUpdates)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({"msg": 'Invalid Request Body. There has been no update.'})
      })
  })
})

describe('GET /api/users', () => {
  it('responds with object with key of users and array of objects showing username, name and avatarurl', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then((res) => {
          expect(res.body.users.length).toBe(4);
          expect(Object.keys(res.body.users[0])).toEqual(['username', 'name', 'avatar_url'])
        });
  })
});
