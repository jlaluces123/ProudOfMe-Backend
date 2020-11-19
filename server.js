const express = require('express');
const bodyParser = require('body-parser');
const cookieSessions = require('cookie-session');
const passport = require('passport');
const passportConfig = require('./config/passport');
const { authRouter, profileRouter } = require('./api/routes/index');
const cors = require('cors');
const config = require('./config/index');
const mongoose = require('mongoose');

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
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }

    next();
});

app.get('/', (req, res) => res.send('SANITY Check: good'));

app.listen(config.port, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    console.log(`Listening on port ${config.port}`);
});
