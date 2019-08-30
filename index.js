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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
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
  res.render("index", { title: "Home", drinks : drinks});
});
//app.use('/', routes);
app.use('/clients', clients);
app.use('/horoscopeList', horoscopeListController);

app.get("/user", (req, res) => {
  res.render("user", { title: "Profile", userProfile: { nickname: "network",participants:"millions of austrollogers",Scientists:"Data Scientists",Storage:"MongoDB in azure cloud",technology:"AI & ML" } });
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
app.post('/UpdateSign', manageController.postUpdateSign);
app.post('/manage', manageController.postManage);
app.post('/contact', contactController.postContact);
app.post('/horoscope', horoscopeController.postHoroscope);
app.get('/api/chart', apiController.getChart);

require("dotenv").config();

if (app.get("env") === "production") {
  session.cookie.secure = true; // Serve secure cookies, requires HTTPS
}
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });