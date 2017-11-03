// Update with your config settings.
const path = require('path')

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/ajax_blog_dev',
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost:5432/ajax_blog_test',
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds')
    }
  },
}

// npm run knex migrate:make create_posts_table
