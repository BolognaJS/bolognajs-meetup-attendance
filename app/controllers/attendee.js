const fetch = require('node-fetch')
const assert = require('assert')
const { meetupKey, meetupUser } = require('../config/meetup')

class Attendee {
  constructor (db) {
    this.checkin = db.collection('checkin')
  }

  list (req, res) {
    const meetupId = parseInt(req.params.id)

    fetch(`https://api.meetup.com/${meetupUser}/events/${meetupId}/attendance/?key=${meetupKey}&sign=true`)
      .then(res => res.json())
      .then(json => {
        if (json.errors) { return res.status(404).send(JSON.stringify(json)) }

        this.checkin.find({ eventId: meetupId }).toArray((err, docs) => {
          assert.equal(err, null)

          const userList = json.filter(function (user) {
            return user.rsvp.response === 'yes'
          }).map(function (user) {
            return {
              id: user.member.id,
              name: user.member.name,
              photo: user.member.photo && user.member.photo.highres_link,
              checkin: docs.some(checkin => checkin.userId === user.member.id)
            }
          })
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify(userList))
        })
      })
  };
}

module.exports = Attendee
