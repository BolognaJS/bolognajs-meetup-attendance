const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongo = require('mongodb')
const assert = require('assert')

const { databaseUri, databaseName } = require('./app/config/database')

const routes = require('./app/routes')

const app = express()

app.use(bodyParser.json())
app.use(cors())

mongo.connect(databaseUri, function (err, client) {
  assert.equal(null, err)
  console.log('Connected successfully to server')
  const db = client.db(databaseName)

  routes(app, db)

  app.listen(3000, function () {
    console.log('BolognaJS Api Ready')
  })
})
