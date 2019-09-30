const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_URI;
var ObjectId = require('mongodb').ObjectID;
const options = {
    keepAlive: 300000, 
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology :true
};
const client = new MongoClient(uri, options);



router.get('/', function(req, res, next) {
    client.connect(err => {
        const collection = client.db(process.env.DB_NAME).collection('horoscope');
        collection.find({}).toArray(function(err, result) {
            if (err) throw err;
            client.close();
            res.json(result);
        });
    });
});

router.post('/', function(req, res, next) {
    client.connect(err => {
        const collection = client.db(process.env.DB_NAME).collection('horoscope');
        collection.insertOne(getHoroscopeCollection(req), function(err, res) {
            if (err) throw err;
            client.close();
          });
    });
});

router.put('/', function(req, res, next) {
    var item = prepareUpdateHoroscope(req);
    client.connect(err => {
        const collection = client.db(process.env.DB_NAME).collection('horoscope');
        var query = { _id: req.body._id};
        collection.updateOne(query,item, function(err, res) {
            if (err) throw err;
            client.close();
            res.json(item);
          });
    });
});

router.delete('/', function(req, res, next) {
    client.connect(err => {
        const collection = client.db(process.env.DB_NAME).collection('horoscope');
        collection.deleteOne({ "_id" : ObjectId(req.body._id) }, function(err, obj) {
            if (err) throw err;
            client.close();
          });
    });
    return res.redirect('/horoscopeCollection');
});

var prepareUpdateHoroscope = function(req)
{
    var rashi = req.body.radSign;
    var star = req.body.ddlStar;
    var starPosition = getStarPosition(req); 
    var prediction = req.body.txtPrediction;
    var dataModel = {
        sign : rashi,
        star : star,
        planet :  starPosition,
        icon : getSignHtmlCode(rashi),
        prediction : prediction
    }
   var model = { $set: dataModel};
   return model;
}
var getHoroscopeCollection = function(req)
{
    var rashi = req.body.radSign;
    var star = req.body.ddlStar;
    var starPosition = getStarPosition(req); 
    var prediction = req.body.txtPrediction;
    var dataModel = {
        sign : rashi,
        star : star,
        planet :  starPosition,
        icon : getSignHtmlCode(rashi),
        prediction : prediction
    }
   return dataModel;
}
var getStarPosition = function(req)
{
    return req.body.radRahu + "." + req.body.radKetu + "." + req.body.radKuja + "." + req.body.radBudha + '.' + req.body.radMoon + '.' + req.body.radGuru + '.' + req.body.radShukra + '.' + req.body.radShani; 
}
var getSignHtmlCode = function(pSign) {
    var iCode;
    switch(pSign)
    {
        case "Aries":
            iCode = '&#9800;'; 
            break;
        case "Taurus":
            iCode = '&#9801;'; 
            break;
        case "Gemini":
            iCode = '&#9802;'; 
            break;
        case "Cancer":
            iCode = '&#9803;'; 
            break;
        case "Leo":
            iCode = '&#9804;'; 
            break;
        case "Virgo":
            iCode = '&#9805;'; 
            break;
        case "Libra":
            iCode = '&#9806;'; 
            break;
        case "Scorpion":
            iCode = '&#9807;'; 
            break;
        case "Sagattarius":
            iCode = '&#9808;'; 
            break;
        case "Capricorn":
            iCode = '&#9809;'; 
            break;
        case "Aquarius":
            iCode = '&#9810;'; 
            break;
        case "Pisces":
            iCode = '&#9811;'; 
            break;
        default:
            iCode = "&#9800;";
    }
    return iCode;
  };
module.exports = router;