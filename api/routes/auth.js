const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('something_here', { user: req.user });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('User Request Object: ', req.user);
    res.redirect(`/api/user/${req.user.googleId}`);
});

module.exports = router;
