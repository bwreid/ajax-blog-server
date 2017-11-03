const fs = require('fs')
const { Post } = require('../../models')

describe('Post', function () {
  describe('#get()', function () {
    it('should return all posts', function () {
      const expected = []
      return Post.get().then(actual => {
        expect(actual).to.deep.equal(expected)
      })
    })
  })

  describe('#create(body)', function () {
    it('should return all posts', function () {
      return Post.create({ title: 'xxx', content: 'yyy' }).then(actual => {
        expect(actual.id).to.be.ok
        expect(actual.title).to.deep.equal('xxx')
        expect(actual.content).to.deep.equal('yyy')
      })
    })
  })

  describe('#find(id)', function () {
    it('should find the specified post', function () {
      const data = { title: 'xxx', content: 'yyy' }
      return knex('posts').insert(data, '*').then(([ inserted ]) => {
        return Post.find(inserted.id).then(post => {
          expect(post.id).to.be.ok
          expect(post.title).to.deep.equal(data.title)
          expect(post.content).to.deep.equal(data.content)
        })
      })
    })
  })

  describe('#destroy', function () {
    it('should remove the specified post', function () {
      const data = { title: 'xxx', content: 'yyy' }
      return knex('posts').insert(data, '*').then(([ inserted ]) => {
        return Post.destroy(inserted.id).then(post => {
          return knex('posts').then(actual => {
            expect(post.id).to.be.ok
            expect(post.title).to.deep.equal(data.title)
            expect(post.content).to.deep.equal(data.content)
            expect(actual.length).to.equal(0)
          })
        })
      })
    })
  })

  describe('#patch', function () {
    it('should patch an existing record', function () {
      const data = { title: 'xxx', content: 'yyy' }
      return knex('posts').insert(data, '*').then(([ inserted ]) => {
        const patch = { title: 'zzz' }
        return Promise.all([ Post.patch(inserted.id, patch), knex('posts') ])
          .then(([ post, actual ]) => {
            expect(post.id).to.be.ok
            expect(post.title).to.deep.equal(patch.title)
            expect(post.content).to.deep.equal(data.content)
            expect(actual.length).to.equal(1)
          })
      })
    })
  })
})
