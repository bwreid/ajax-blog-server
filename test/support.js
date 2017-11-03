const fs = require('fs')
const path = require('path')

global.app = require('../app')
global.chai = require('chai')
global.expect = chai.expect

require('mocha')
chai.use(require('chai-http'))
chai.use(require('chai-as-promised'))

global.db = path.join(__dirname, '..', 'db', 'test.json')
global.knex = require('../db/connection')
const clear = () => knex.migrate.rollback().then(() => knex.migrate.latest())
const destroyConn = () => knex.destroy()

beforeEach(clear)
after(destroyConn)
