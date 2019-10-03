const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const engines = require('consolidate');

const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-timebase, Authorization, x-token, appkey"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.json());
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// enable html
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', engines.mustache);

// Routes
app.use('/auth', authRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;