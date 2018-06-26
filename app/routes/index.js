const Attendee = require('../controllers/attendee')

module.exports = function (app, db) {
  const attendee = new Attendee(db)

  app.get('/attendee/:id', attendee.list.bind(attendee))
}
