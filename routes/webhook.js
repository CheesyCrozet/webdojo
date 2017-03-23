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

router.post('/', function(req, res) {
    console.log("Requete POST recue");
    var data = req.body;
    console.log(JSON.stringify(data));
    if(data.object === 'page') {
        console("Requete recue d'une page");
        res.status(200);
    } else {
        console.log("pas une page");
        res.send("vous n'etes pas une page");
    };
});

module.exports = router;
