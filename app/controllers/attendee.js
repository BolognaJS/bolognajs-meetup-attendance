const fetch = require('node-fetch')
const { meetupKey, meetupUser } = require('../config/meetup')

function Attendee () {
  this.list = function (req, res) {
    var meetupId = req.params.id
    fetch(`https://api.meetup.com/${meetupUser}/events/${meetupId}/attendance/?key=${meetupKey}&sign=true`)
      .then(res => res.json())
      .then(json => {
        if (json.errors) return res.status(404).send(JSON.stringify(json))

        const userList = json.filter(function (user) {
          return user.rsvp.response === 'yes'
        }).map(function (user) {
          return {
            name: user.member.name,
            photo: user.member.photo && user.member.photo.highres_link
          }
        })
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(userList))
      })
  }
}

module.exports = Attendee
