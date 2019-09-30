const validator = require('validator');
const nodemailer = require('nodemailer');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology :true
};
const client = new MongoClient(uri, options);

exports.getHoroscope = (req, res) => {
   res.render('horoscope', {
      title: 'horoscope'
     });
  };

exports.getHoroscopeList = (req, res) => {
    client.connect(err => {
        const collection = client.db(process.env.DB_NAME).collection('horoscope');
        collection.find({}).toArray(function(err, result) {
            if (err) throw err;
            client.close();
            res.render('horoscopeLists', {
                title: 'Horoscope List',
                horoscopeList : result
            });
        });
    });
};
 
exports.postHoroscope = (req, res) => {
    const validationErrors = [];
    if (!req.body.radSign){
        validationErrors.push({ msg: "Please choose Sign Name."});
    }
    if (validator.equals(req.body.ddlStar,"-- Select --")){
        validationErrors.push({ msg: "Please select Star."});
    }
    if (!req.body.radRahu){
        validationErrors.push({ msg: "Please choose House of Rahu."});
    }
    if (!req.body.radKetu){
        validationErrors.push({ msg: "Please choose House of Ketu."});
    }
    if (!req.body.radKuja){
        validationErrors.push({ msg: "Please choose House of Kuja."});
    }
    if (!req.body.radBudha){
        validationErrors.push({ msg: "Please choose House of Budha."});
    }
    if (!req.body.radMoon){
        validationErrors.push({ msg: "Please choose House of Moon."});
    }
    if (!req.body.radGuru){
        validationErrors.push({ msg: "Please choose House of Guru."});
    }
    if (!req.body.radShukra){
        validationErrors.push({ msg: "Please choose House of Shukra."});
    }
    if (!req.body.radShani){
        validationErrors.push({ msg: "Please choose House of Shani."});
    }
    if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('/horoscope');
    }
    if(validationErrors.length == 0){
        client.connect(err => {
            const db = client.db(process.env.DB_NAME).collection('horoscope');
            db.insertOne(getHoroscopeCollection(req));
            client.close(); 
        });
        validationErrors.push({ msg: "Your data has been sent to cloud successfully." });
        req.flash('success', validationErrors);
        return res.redirect('/horoscope');
    }
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
        case "Sagittarius":
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