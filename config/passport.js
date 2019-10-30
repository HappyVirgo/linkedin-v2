var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

var client_id = '775lax6311tpvc';
var client_secret = 'TyP1rAhnEEAWZsAC';
var url = 'http://localhost:4001';

passport.use(new LinkedInStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: url + '/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_ads', 'w_organization_social', 'rw_ads', 'r_basicprofile', 'r_liteprofile', 'r_ads_reporting', 'r_organization_social', 'rw_organization_admin', 'w_member_social', 'r_1st_connections_size'],
}, (accessToken, refreshToken, profile, callback) => {
    var user = {
        accessToken: accessToken
    };
    return callback(null, user);
}));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((obj, callback) => {
    callback(null, obj);
});

module.exports = passport;
