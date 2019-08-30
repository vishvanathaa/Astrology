const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_URI;
const moment = require('moment');
const options = {
    keepAlive: 300000, 
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology :true
};
const client = new MongoClient(uri, options);
exports.getBirthSign = (req,res)=>{
    let birthsign = req.query.sign;var Description;
    client.connect(err => {
        const collection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
        var myquery = { name: birthsign };
        collection.find(myquery, function(err, allDetails) {
            allDetails.forEach(function (item) {
                var curMonth = moment(Date.now()).format('MMMM');
                Description = item.description.replace(/August/g, curMonth)
            },function(){
            client.close();
            res.render('birthsign',{
                title: 'Birth Sign',
                description : Description,
                sign : birthsign,
                signCode : getSignHtmlCode(birthsign)
            });})
        });
    });
};
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
        case "Scorpio":
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
