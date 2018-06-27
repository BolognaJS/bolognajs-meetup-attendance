const { validationResult } = require('express-validator/check')

class Checkin {
  constructor (db) {
    this.checkinCollection = db.collection('checkin')
  }

  async updateCheckin (req, res) {
    res.setHeader('Content-Type', 'application/json')
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) throw JSON.stringify({ errors: errors.array() })

      const request = req.body
      const query = {
        userId: request.userId,
        eventId: request.eventId
      }
      const update = {
        userId: request.userId,
        eventId: request.eventId,
        checkin: request.checkin
      }
      var result = await this.checkinCollection.update(query, update, {upsert: true})

      res.json(result)
    } catch (error) {
      res.status(422).send(error)
    }
  };
}

module.exports = Checkin
