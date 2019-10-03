const express = require('express');
const router = express.Router();
const request = require('request');
const passport = require('../config/passport');

router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/social/linkedin/failure' }), (req, res) => {
    res.render('../views/success.html', { token: req.user.accessToken });
});

router.get('/linkedin/failure', (req, res) => {
    res.render('../views/failure.html');
});

// Linkedin API Requests
router.get('/linkedin/api/:token', (req, res) => {
    const token = req.params.token;
    var start_date = new Date();
    start_date.setFullYear(start_date.getFullYear() - 1);
    var end_date = new Date();
    request.get({
        json: true,
        url: 'https://api.linkedin.com/v2/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:{39763}&timeIntervals=(timeRange:(start:1551398400000,end:1552003200000)',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, (err, response, body) => {
        if (err) {
            res.send({ success: false, err });
        } else {
            res.send({ success: true, token, body });
        }
    });
});

module.exports = router;
