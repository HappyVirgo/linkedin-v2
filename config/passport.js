var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

var client_id = '775lax6311tpvc';
var client_secret = 'TyP1rAhnEEAWZsAC';
var url = 'http://localhost:4001';

passport.use(new LinkedInStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: url + '/auth/linkedin/callback',
    profileFields: ['r_ad_campaigns', 'rw_organization', 'r_liteprofile', 'rw_organization_admin', 'r_organization_social', 'w_organization_social']
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
