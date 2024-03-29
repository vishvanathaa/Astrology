// index.js
const path = require("path");
const express = require("express");
const authRouter = require("./auth");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || "8000";
const flash = require('express-flash');
const contactController = require('./controllers/contact');
const homeController = require('./controllers/home');
const zodiacController = require('./controllers/zodiac');
const manageController = require('./controllers/manage');
const birthsignController = require('./controllers/birthsign');
const horoscopeController = require('./controllers/horoscope');
const clients = require('./controllers/clients');
const horoscopeListController = require('./controllers/horoscopeList');
const apiController = require('./controllers/api');
const shoppingController = require('./controllers/shopping');
const uuidv1 = require('uuid/v1');
const chatAccessToken = process.env.ACCESS_TOKEN;
const AI_SESSION_ID = uuidv1();
const dialogflow = require('apiai');
const ai = dialogflow(chatAccessToken);

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/views')); // HTML Pages

app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use('/scripts', express.static(path.join(__dirname +'/node_modules/@fortawesome/fontawesome-free/css')));
app.use(express.static(path.join(__dirname, "node_modules")));
// Authentication section
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const session = {
  secret: "LoxodontaElephasMammuthusPalaeoloxodonPrimelephas",
  cookie: {},
  resave: false,
  saveUninitialized: false
};

app.use(expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))
// res.locals is an object passed to hbs engine
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});


const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://nibc1662:8000/callback"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API 
     * (resource server)
     * accessToken is the token to call the Auth0 API 
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);
app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.locals.moment = require('moment') ; 
passport.use(strategy);
passport.serializeUser((user, done) => {
    done(null, user);
  });

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use("/", authRouter);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });

// Authentication section ends here
app.get("/", (req, res) => {
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
  res.render("index", { title: "Home", drinks : drinks,signDetails : []});
});
//app.use('/', routes);
app.use('/clients', clients);
app.use('/horoscopeList', horoscopeListController);
app.use('/', shoppingController);

app.get("/user", (req, res) => {
  res.render("user", { title: "Profile", userProfile: { nickname: "network",participants:"millions of astrollogers",Scientists:"Data Scientists",Storage:"MongoDB in azure cloud",technology:"AI & ML" } });
});
app.get("/matrimonyConsultation", (req, res) => {
  res.render("matrimonyConsultation",{title: "matrimony"})
});
app.get("/horoscopeGrid", (req, res) => {
  res.render("horoscopeGrid",{title: "horoscope"})
});
app.get('/horoscopeCollection', (req, res) => {
  res.render('horoscopeCollection', { title: 'Horoscope List' });
});

app.get('/home', homeController.index);
app.get('/zodiacSign', zodiacController.index);
app.get('/contact', contactController.getContact);
app.get('/manage', manageController.getManage);
app.get('/birthsign', birthsignController.getBirthSign);
app.get('/UpdateSign', manageController.getSignForUpdate);
app.get('/horoscope', horoscopeController.getHoroscope);
app.get('/horoscopeLists', horoscopeController.getHoroscopeList);
app.post('/UpdateSign', manageController.postUpdateSign);
app.post('/manage', manageController.postManage);
app.post('/contact', contactController.postContact);
app.post('/horoscope', horoscopeController.postHoroscope);
app.get('/api/chart', apiController.getChart);
app.get('/api/financialGrowth', apiController.getFinanceGraph);
app.get('/api/relationshipGraph', apiController.getRelationshipGraph);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);



require("dotenv").config();

if (app.get("env") === "production") {
  session.cookie.secure = true; // Serve secure cookies, requires HTTPS
}
// app.listen(port, () => {
//     console.log(`Listening to requests on http://localhost:${port}`);
//   });

  const server = app.listen(port, function(){
    console.log('listening on  port %d', server.address().port);
  });
  
  
  const socketio = require('socket.io')(server);
  socketio.on('connection', function(socket){
    console.log('a user connected');
  });
  
  //Serve UI
  app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/views/app.html');
  });
  
  app.get("/chatbot", (req, res) => {
    res.render("chatbot",{title: "Chat"})
  });
  
  socketio.on('connection', function(socket) {
    socket.on('chat request', (text) => {
      console.log('Message: ' + text);
  
      // Get a reply from API.ai
  
      let aiReq = ai.textRequest(text, {
        sessionId: AI_SESSION_ID
      });
  
      aiReq.on('response', (response) => {
        let aiResponse = response.result.fulfillment.speech;
        console.log('AI Response: ' + aiResponse);
        socket.emit('ai response', aiResponse);
      });
  
      aiReq.on('error', (error) => {
        console.log(error);
      });
  
      aiReq.end();
  
    });
  });