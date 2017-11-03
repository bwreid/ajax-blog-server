const { Post } = require('../models')
const fields = [ 'title', 'content' ]

function get (req, res, next) {
  Post.get().then(posts => {
    res.json({ posts })
  })
}

function create (req, res, next) {
  Post.create(req.body).then(post => {
    res.status(201).json({ post })
  })
}

function show (req, res, next) {
  Post.find(req.params.id).then(post => {
    res.json({ post })
  })
}

function destroy (req, res, next) {
  Post.destroy(req.params.id).then(post => {
    res.json({ post })
  })
}

function patch (req, res, next) {
  Post.patch(req.params.id, req.body).then(post => {
    res.json({ post })
  })
}

function exists (req, res, next) {
  Post.find(req.params.id).then(post => {
    if (!post) {
      const status = 404
      const message = `Post with an id of ${req.params.id} was not found`
      return next({ status, message })
    }

    return next()
  })
}

function prune (req, res, next) {
  Object.keys(req.body).forEach(key => {
    if (!fields.includes(key)) delete req.body[key]
  })

  next()
}

function complete (req, res, next) {
  const errors = fields.filter(field => !req.body[field])
    .map(key => `${key} is a required field`)

  if (errors.length) {
    const status = 400
    const message = `Fields are missing: ${errors.join(', ')}`
    return next({ status, message })
  }

  return next()
}

module.exports = {
  get, create, show, destroy, patch,
  validations: { exists, prune, complete }
}
