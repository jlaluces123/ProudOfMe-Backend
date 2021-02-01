const express = require('express');
const bodyParser = require('body-parser');
const cookieSessions = require('cookie-session');
const passport = require('passport');
const passportConfig = require('./config/passport');
const {
    authRouter,
    profileRouter,
    usersRouter,
} = require('./api/routes/index');
const cors = require('cors');
const config = require('./config/index');
const mongoose = require('mongoose');
const Moment = require('./models/Moment');

const app = express();

// Initialize CookieSessions
app.use(
    cookieSessions({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [config.cookie_key],
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/auth/', authRouter);
app.use('/api/user/', profileRouter);
app.use('/api/users/', usersRouter);

// Connect to MongoDB
mongoose.connect(
    config.mongo_uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('Connected to MongoDB');
    }
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.get('/', (req, res) => {
    // This function is used to update any old schemas if we add more properties in the future
    // async function addPublicField() {
    //     console.log('Updating old schemas to public: false...');
    //     await Moment.updateMany({}, { $set: { public: false } });
    // }

    // addPublicField();
    res.send('SANITY Check: good');
});

app.listen(config.port, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    console.log(`Listening on port ${config.port}`);
});
