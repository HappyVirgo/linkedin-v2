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

const sendGet = (url, token) => {
    return new Promise((resolve, reject) => {
        request.get({
            json: true,
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }, (err, response, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
};

// Linkedin API Requests
router.post('/linkedin/api', async (req, res) => {
    const token = req.headers['token'];

    var { start_date, end_date } = req.body;
    if (!start_date || !end_date) {
        res.send({ success: false, message: 'Invallid date' });
        return;
    }
    start_date = new Date(start_date);
    end_date = new Date(end_date);
    // var start_date = new Date();
    // start_date.setMonth(start_date.getMonth() - 1);
    // start_date.setDate(start_date.getDate() - 1);
    // start_date.setHours(0);
    // start_date.setMinutes(0);
    // start_date.setSeconds(0);
    // start_date.setMilliseconds(0);
    // var end_date = new Date();
    // // end_date.setDate(end_date.getDate() - 1);
    // end_date.setHours(0);
    // end_date.setMinutes(0);
    // end_date.setSeconds(0);
    // end_date.setMilliseconds(0);
    var unique_visitors = 0, new_followers = 0, post_impressions = 0, custom_button_clicks = 0;
    
    try {
        var url = `https://api.linkedin.com/v2/organizationPageStatistics?q=organization&organization=urn:li:organization:39763&timeIntervals.timeGranularityType=DAY&timeIntervals.timeRange.start=${start_date.getTime()}&timeIntervals.timeRange.end=${end_date.getTime()}`;
        var pageInfo = await sendGet(url, token);
        pageInfo.elements.forEach(element => {
            element.totalPageStatistics.clicks.mobileCustomButtonClickCounts.forEach(obj => {
                custom_button_clicks += obj.clicks * 1;
            });
            element.totalPageStatistics.clicks.desktopCustomButtonClickCounts.forEach(obj => {
                custom_button_clicks += obj.clicks * 1;
            });
            var views = element.totalPageStatistics.views
            unique_visitors += views.allPageViews.uniquePageViews * 1;
            // for (var key in views) {
            //     unique_visitors += views[key].uniquePageViews * 1;
            // }
        });

        url = `https://api.linkedin.com/v2/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:39763&timeIntervals.timeGranularityType=DAY&timeIntervals.timeRange.start=${start_date.getTime()}&timeIntervals.timeRange.end=${end_date.getTime()}`;
        var followerInfo = await sendGet(url, token);
        followerInfo.elements.forEach(element => {
            new_followers += element.followerGains.paidFollowerGain * 1;
            new_followers += element.followerGains.organicFollowerGain * 1;
        });

        url = `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:39763&timeIntervals.timeGranularityType=DAY&timeIntervals.timeRange.start=${start_date.getTime()}&timeIntervals.timeRange.end=${end_date.getTime()}`;
        var shareInfo = await sendGet(url, token);
        shareInfo.elements.forEach(element => {
            // post_impressions += element.totalShareStatistics.uniqueImpressionsCount * 1;
            post_impressions += element.totalShareStatistics.impressionCount * 1;
        });

        res.send({
            success: true,
            from: start_date,
            to: end_date,
            data: {
                unique_visitors,
                new_followers,
                post_impressions,
                custom_button_clicks,
                shareInfo
            }
        });
    } catch(err) {
        console.log(err);
        res.send({ success: false, message: 'Error occurred' });
    }
});

module.exports = router;
