var express = require('express');
var router = express.Router();

const
chatService = require('../server/chatService'),
weatherService = require('../server/weatherService'),
WeatherData = require('../server/model/weatherData'),
userService = require('../server/userService'),
parser = require('json-parser');

/* GET webhook auth. */
router.get('/', function(req, res, next) {
    if (chatService.authenticate(req)) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    };
});

router.get('/webhook', function(req, res) {
});

router.post('/webhook', function(req, res) {
    //chatService.authenticate(res);
    var data = req.body;

    if(data.object === 'page') {
        console.log("ya un truc");
        data.entry.forEach(function(entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            entry.messaging.forEach(function(event) {
                if(event.message) {
                    receivedMessage(event);
                } else {
                    console.log("Webhook unknow event", event);
                }
            });
        });
        req.sendStatus(200);
    }

});

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {
        switch (messageText) {
            case 'generic':
            sendGenericMessage(senderID);
            break;
            default:
            sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
};

module.exports = router;
