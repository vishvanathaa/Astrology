const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology :true
};
exports.index = (req, res) => {
  res.render('zodiacSign',{
              title: 'Zodiac Sign',signDetails : []});
};
//var Spinner = require('cli-spinner').Spinner;
//var spinner = new Spinner('processing.. %s');
const client = new MongoClient(uri, options);
exports.indexOld = (req, res) => {
  var signDetails = [];
  //spinner.setSpinnerString('|/-\\');
 // spinner.start();
  client.connect(err => {
      const collection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
      var myquery = { "name" : { "$in" : ['Aries' , 'Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']}}
      collection.find(myquery, function(err, allDetails) {
          allDetails.forEach(function (item) {
            signDetails.push(item);
          },function(){
          client.close();
          res.render('zodiacSign',{
              title: 'Zodiac Sign',
              signDetails : signDetails
          });})
      });
  });
};