const fs = require('fs')

describe('post routes', function () {
  describe('GET /', function () {
    it('should return all posts', function (done) {
      const expected = { posts: [] }
      chai.request(app)
        .get('/posts')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.deep.equal(expected)
          done()
        })
    })
  })

  describe('POST /', function () {
    it('should create a new post', function (done) {
      const post = { title: 'xxx', content: 'yyy' }
      chai.request(app)
      .post('/posts')
      .send(post)
      .end((err, res) => {
        expect(res.status).to.equal(201)
        expect(res.body.post.id).to.be.ok
        expect(res.body.post.title).to.deep.equal('xxx')
        expect(res.body.post.content).to.deep.equal('yyy')
        done()
      })
    })

    it('should ignore extra keys', function (done) {
      const post = { title: 'xxx', content: 'yyy', tags: 'zzz' }
      chai.request(app)
      .post('/posts')
      .send(post)
      .end((err, res) => {
        expect(res.status).to.equal(201)
        expect(res.body.post.id).to.be.ok
        expect(res.body.post.title).to.deep.equal('xxx')
        expect(res.body.post.content).to.deep.equal('yyy')
        expect(res.body.post.tags).to.be.undefined
        done()
      })
    })

    it('should require that the `content` field is present', function (done) {
      const post = { title: 'xxx' }
      chai.request(app)
      .post('/posts')
      .send(post)
      .end((err, res) => {
        expect(res.status).to.equal(400)
        expect(res.body.error).to.be.ok
        expect(res.body.error.message).to.be.ok
        done()
      })
    })

    it('should require that the `title` field is present', function (done) {
      const post = { content: 'xxx' }
      chai.request(app)
      .post('/posts')
      .send(post)
      .end((err, res) => {
        expect(res.status).to.equal(400)
        expect(res.body.error).to.be.ok
        expect(res.body.error.message).to.be.ok
        done()
      })
    })
  })

  describe('GET /:id', function () {
    it('should retrieve a specific post', function (done) {
      knex('posts').insert({ title: 'xxx', content: 'yyy' }, '*').then(([ post ]) => {
        chai.request(app)
        .get(`/posts/${post.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.post.id).to.deep.equal(post.id)
          expect(res.body.post.title).to.deep.equal(post.title)
          expect(res.body.post.content).to.deep.equal(post.content)
          done()
        })
      })
    })

    it('should require that the id is a valid post id', function (done) {
      chai.request(app)
      .get(`/posts/99`)
      .end((err, res) => {
        expect(res.status).to.equal(404)
        expect(res.body.error).to.be.ok
        expect(res.body.error.message).to.be.ok
        done()
      })
    })
  })

  describe('DELETE /:id', function () {
    it('should destroy a specific post', function (done) {
      knex('posts').insert({ title: 'xxx', content: 'yyy' }, '*').then(([ post ]) => {
        chai.request(app)
          .delete(`/posts/${post.id}`)
          .end((err, res) => {
            expect(res.status).to.equal(200)
            expect(res.body.post.id).to.deep.equal(post.id)
            expect(res.body.post.title).to.deep.equal(post.title)
            expect(res.body.post.content).to.deep.equal(post.content)
            done()
          })
      })
    })

    it('should require that the id is a valid post id', function (done) {
      chai.request(app)
      .delete(`/posts/99`)
      .end((err, res) => {
        expect(res.status).to.equal(404)
        expect(res.body.error).to.be.ok
        expect(res.body.error.message).to.be.ok
        done()
      })
    })
  })

  describe('PATCH /:id', function () {
    it('should partially modify an existing post', function (done) {
      knex('posts').insert({ title: 'xxx', content: 'yyy' }, '*').then(([ post ]) => {
        const patch = { title: 'zzz' }
        const expected = Object.assign(post, patch)
        chai.request(app)
          .patch(`/posts/${post.id}`)
          .send(patch)
          .end((err, res) => {
            expect(res.status).to.equal(200)
            expect(res.body.post.id).to.deep.equal(post.id)
            expect(res.body.post.title).to.deep.equal(post.title)
            expect(res.body.post.content).to.deep.equal(post.content)
            done()
          })
      })
    })

    it('should require that the id is a valid post id', function (done) {
      chai.request(app)
      .patch(`/posts/99`)
      .send({ title: 'zzz' })
      .end((err, res) => {
        expect(res.status).to.equal(404)
        expect(res.body.error).to.be.ok
        expect(res.body.error.message).to.be.ok
        done()
      })
    })

    it('should completely modify an existing post', function (done) {
      knex('posts').insert({ title: 'xxx', content: 'yyy' }, '*').then(([ post ]) => {
        const patch = { title: 'zzz', tags: 'aaa' }
        const expected = Object.assign(post, { title: 'zzz' })
        chai.request(app)
          .patch(`/posts/${post.id}`)
          .send(patch)
          .end((err, res) => {
            expect(res.status).to.equal(200)
            expect(res.body.post.id).to.deep.equal(post.id)
            expect(res.body.post.title).to.deep.equal(post.title)
            expect(res.body.post.content).to.deep.equal(post.content)
            done()
          })
      })
    })
  })

  describe('PUT /:id', function () {
    it('should completely modify an existing post', function (done) {
      knex('posts').insert({ title: 'xxx', content: 'yyy' }, '*').then(([ post ]) => {
        const replacement = { title: 'zzz', content: 'www' }
        const expected = Object.assign(post, replacement)
        chai.request(app)
          .put(`/posts/${post.id}`)
          .send(replacement)
          .end((err, res) => {
            expect(res.status).to.equal(200)
            expect(res.body.post.id).to.deep.equal(post.id)
            expect(res.body.post.title).to.deep.equal(post.title)
            expect(res.body.post.content).to.deep.equal(post.content)
            done()
          })
      })
    })

    it('should require that the id is a valid post id', function (done) {
      chai.request(app)
      .put(`/posts/99`)
      .send({ title: 'zzz' })
      .end((err, res) => {
        expect(res.status).to.equal(404)
        expect(res.body.error).to.be.ok
        expect(res.body.error.message).to.be.ok
        done()
      })
    })

    it('should ignore extra keys', function (done) {
      knex('posts').insert({ title: 'xxx', content: 'yyy' }, '*').then(([ post ]) => {
        const replacement = { title: 'zzz', content: 'www', tags: 'zzz' }
        chai.request(app)
        .put(`/posts/${post.id}`)
        .send(replacement)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.post.id).to.be.ok
          expect(res.body.post.title).to.deep.equal('zzz')
          expect(res.body.post.content).to.deep.equal('www')
          expect(res.body.post.tags).to.be.undefined
          done()
        })
      })
    })

    it('should require that the `content` field is present', function (done) {
      knex('posts').insert({ title: 'xxx', content: 'yyy' }, '*').then(([ post ]) => {
        const replacement = { title: 'zzz' }
        chai.request(app)
        .put(`/posts/${post.id}`)
        .send(replacement)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.error).to.be.ok
          expect(res.body.error.message).to.be.ok
          done()
        })
      })
    })

    it('should require that the `title` field is present', function (done) {
      knex('posts').insert({ title: 'xxx', content: 'yyy' }, '*').then(([ post ]) => {
        const replacement = { content: 'www' }
        chai.request(app)
        .put(`/posts/${post.id}`)
        .send(replacement)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.error).to.be.ok
          expect(res.body.error.message).to.be.ok
          done()
        })
      })
    })
  })
})
