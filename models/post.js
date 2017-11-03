const fs = require('fs')
const path = require('path')
const uuid = require('uuid/v4')
const env = process.env.NODE_ENV || 'development'
const db = path.join(__dirname, '..', 'db', `${env}.json`)
const knex = require('../db/connection')

function get () {
  return knex('posts')
}

function create (body) {
  return knex('posts')
    .insert(body)
    .returning('*')
    .then(([post]) => post)
}

function find (id) {
  return knex('posts').where({ id }).first()
}

function destroy (id) {
  return knex('posts')
    .del()
    .where({ id })
    .returning('*')
    .then(([ post ]) => post)
}

function patch (id, patch) {
  return knex('posts')
    .update(patch)
    .where({ id })
    .returning('*')
    .then(([ post ]) => post)
}

module.exports = {
  get, create, find, destroy, patch
}
