const { checkSchema } = require('express-validator/check')

const Attendee = require('../controllers/attendee')
const Checkin = require('../controllers/checkin')
const Events = require('../controllers/events')

module.exports = function (app, db) {
  const attendee = new Attendee(db)
  const checkin = new Checkin(db)
  const events = new Events(db)

  app.get('/attendee/:id', attendee.listAttendee.bind(attendee))
  app.get('/checkedin/:id', attendee.listCheckedin.bind(attendee))

  app.post('/checkin', checkSchema({
    eventId: {isInt: true},
    userId: {isInt: true},
    checkin: {isBoolean: true}
  }), checkin.updateCheckin.bind(checkin))

  app.get('/events', events.listEvents.bind(events))
}
