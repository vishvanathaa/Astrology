/**
 * GET /contact
 * Contact form page.
 */
const validator = require('validator');
const nodemailer = require('nodemailer');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology :true
};
const client = new MongoClient(uri, options);

exports.getSignForUpdate = (req, res) => {
    let birthsign = req.query.sign;var Description;
    const validationErrors = [];
    /* if (!req.isAuthenticated())
    {
      validationErrors.push({ msg: 'You are not authorized to update the content. Please login with your credentials.' });
      req.flash('info', validationErrors);
      return res.redirect('/user');
    } */
    client.connect(err => {
        const collection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
        var myquery = { name: birthsign };
        collection.find(myquery, function(err, allDetails) {
            allDetails.forEach(function (item) {
                Description = item.description;
            },function(){
            client.close();
            res.render('UpdateSign',{
                title: 'Update Sign',
                description : Description,
                sign : birthsign
            });})
        });
    });
};

exports.postUpdateSign = (req, res) => {
  let description;let birthSign;
  description = req.body.message;
  birthSign=req.body.signName;
  const validationErrors = [];
  if (validator.isEmpty(description)) {
    validationErrors.push({ msg: 'Please enter description.' });
  }
  
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/UpdateSign?sign='+birthSign);
  }
  client.connect(err => {
      const collection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
      /* to update the cloud db based on the query */
      var myquery = { name: birthSign };
      var newvalues = { $set: {description: description} };
      collection.updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      });
      client.close();    
  });
  return res.redirect('/ZodiacSign');
}

exports.getManage = (req, res) => {
    const unknownUser = !(req.user);
    req.body.message = 'content'
    res.render('Manage', {
      title: 'Manage',
      description : '',
      unknownUser,
    });
  };

exports.postManage = (req, res) => {
    let description;let birthSign;
    description = req.body.message;
    birthSign=req.body.dlSign;
    const validationErrors = [];
    if (validator.isEmpty(description)) {
      validationErrors.push({ msg: 'Please enter description.' });
    }
    if (validator.equals(birthSign,'-- Select --')) {
      validationErrors.push({ msg: 'Please select sign.' });
    }
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      return res.redirect('/manage');
    }
    else
    {
      if (!req.isAuthenticated())
      {
        validationErrors.push({ msg: 'You are not authorized send content. Please click on login.' });
        req.flash('errors', validationErrors);
        return res.redirect('/manage');
      }
    }
    client.connect(err => {
        const collection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
        /* to update the cloud db based on the query */
        var myquery = { name: birthSign };
        var newvalues = { $set: {description: description} };
        collection.updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        });
        client.close();    
    });
    return res.redirect('/user');
}