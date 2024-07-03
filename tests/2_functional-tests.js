const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

let bookId

suite('Functional Tests', function () {
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200)
        assert.isArray(res.body, 'response should be an array')
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        )
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        )
        assert.property(res.body[0], '_id', 'Books in array should contain _id')
        done()
      })
  })
  suite('Routing tests', function () {
    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({
              title: 'Test Title',
              comments: [],
            })
            .end((err, res) => {
              bookId = res.body._id
              assert.equal(res.status, 200, 'response status should be 200')
              assert.equal(res.body.title, 'Test Title')
              done()
            })
        })
        test('Test POST /api/books with no title given', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({
              title: '',
              comments: [],
            })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200')
              assert.equal(res.text, 'missing required field title')
              done()
            })
        })
      }
    )
    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200, 'response status should be 200')
            assert.isArray(res.body, 'response should be an array')
            done()
          })
      })
    })
    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get('/api/books/668507db6fe1e146dd53d62b')
          .end((err, res) => {
            assert.equal(res.status, 200, 'response status should be 200')
            assert.equal(res.text, 'no book exists')
            done()
          })
      })
      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${bookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'response status should be 200')
            assert.equal(res.body.title, 'Test Title')
            assert.equal(res.body._id, bookId)
            done()
          })
      })
    })
    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          chai
            .request(server)
            .post(`/api/books/${bookId}`)
            .send({ comment: 'Test comment' })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200')
              assert.equal(res.body.title, 'Test Title')
              assert.equal(res.body.comments[0], 'Test comment')
              done()
            })
        })
        test('Test POST /api/books/[id] without comment field', function (done) {
          chai
            .request(server)
            .post(`/api/books/${bookId}`)
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200')
              done()
            })
        })
        test('Test POST /api/books/[id] with comment, id not in db', function (done) {
          chai
            .request(server)
            .post(`/api/books/${bookId.slice(0, bookId.length - 2) + '42'}`)
            .send({ comment: 'Test comment' })
            .end((err, res) => {
              assert.equal(res.status, 200, 'response status should be 200')
              assert.equal(res.text, 'no book exists')
              done()
            })
        })
      }
    )
    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${bookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'response status should be 200')
            assert.equal(res.text, 'delete successful')
            done()
          })
      })
      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${bookId.slice(0, bookId.length - 2) + '42'}`)
          .end((err, res) => {
            assert.equal(res.status, 200, 'response status should be 200')
            assert.equal(res.text, 'no book exists')
            done()
          })
      })
    })
  })
})
