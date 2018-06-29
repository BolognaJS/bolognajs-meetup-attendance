const fetch = require('node-fetch')
const { meetupKey, meetupUser } = require('../config/meetup')

class Events {
  constructor (db) {
    this.checkinCollection = db.collection('checkin')
  }

  _getMeetupEvents (meetupUser, meetupKey) {
    return fetch(`https://api.meetup.com/${meetupUser}/events/?status=past,upcoming&desc=true&key=${meetupKey}&sign=true`)
      .then(res => res.json())
  }

  async _getEventList (meetupUser, meetupKey) {
    const eventList = await this._getMeetupEvents(meetupUser, meetupKey)

    if (eventList.errors) throw JSON.stringify(eventList)

    return Promise.all(eventList
      .map(async event => ({
        id: parseInt(event.id),
        name: event.name,
        date: event.local_date,
        time: event.local_time,
        attendee: event.yes_rsvp_count,
        checkedin: await this.checkinCollection.count({eventId: parseInt(event.id), checkin: true})
      })))
  }

  async listEvents (req, res) {
    res.setHeader('Content-Type', 'application/json')
    try {
      const eventList = await this._getEventList(meetupUser, meetupKey)

      res.json(eventList)
    } catch (error) {
      res.status(400).send(error)
    }
  };
}

module.exports = Events
