var express = require('express');
var fetch = require('node-fetch');

var app = express();
const meetupKey = process.env.MEETUP_API_KEY;

app.get('/attendee/:id', function (req, res) {
    var meetupId = req.params.id;
    fetch(`https://api.meetup.com/Bologna-JS-Meetup/events/${meetupId}/attendance/?key=${meetupKey}&sign=true`)
        .then(res => res.json())
        .then(json => {
            if(json.errors) return res.status(404).send('Sorry cant find that!');

            const userList = json.filter(function(user){
                return user.rsvp.response === "yes";
            }).map(function(user){
                return {
                    name: user.member.name,
                    photo: user.member.photo && user.member.photo.highres_link
                };
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(userList));
        });
});

app.listen(3000, function () {
  console.log('BolognaJS Api Ready');
});
