const Attendee = require('../controllers/attendee')

module.exports = function (app) {
  const attendee = new Attendee()

  app.get('/attendee/:id', attendee.list)
}
