const fetch = require('node-fetch')
const { meetupKey, meetupUser } = require('../config/meetup')

class Attendee {
  constructor (db) {
    this.checkinCollection = db.collection('checkin')
  }

  _getMeetupAttendee (meetupId, meetupUser, meetupKey) {
    return fetch(`https://api.meetup.com/${meetupUser}/events/${meetupId}/rsvps/?key=${meetupKey}&sign=true`)
      .then(res => res.json())
  }

  async _getAttendeeList (meetupId, meetupUser, meetupKey) {
    const attendeeList = await this._getMeetupAttendee(meetupId, meetupUser, meetupKey)

    if (attendeeList.errors) throw JSON.stringify(attendeeList)

    const checkinList = await this.checkinCollection.find({ eventId: meetupId }).toArray()

    return attendeeList
      .filter(user => user.response === 'yes')
      .map(user => {
        const checkinUser = checkinList.find(checkin => checkin.userId === user.member.id)
        return {
          id: user.member.id,
          name: user.member.name,
          photo: user.member.photo && user.member.photo.highres_link,
          checkin: checkinUser ? checkinUser.checkin : null
        }
      })
  }

  async listAttendee (req, res) {
    res.setHeader('Content-Type', 'application/json')
    try {
      const meetupId = parseInt(req.params.id)
      const attendeeList = await this._getAttendeeList(meetupId, meetupUser, meetupKey)

      res.json(attendeeList)
    } catch (error) {
      res.status(400).send(error)
    }
  };

  async listCheckedin (req, res) {
    res.setHeader('Content-Type', 'application/json')
    try {
      const meetupId = parseInt(req.params.id)
      const attendeeList = await this._getAttendeeList(meetupId, meetupUser, meetupKey)
      const checkedinList = attendeeList.filter(user => user.checkin)

      res.json(checkedinList)
    } catch (error) {
      res.status(400).send(error)
    }
  };
}

module.exports = Attendee
