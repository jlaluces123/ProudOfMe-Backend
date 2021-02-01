const router = require('express').Router();
const User = require('../../models/User');
const Moment = require('../../models/Moment');

/* 

    URL: /api/user/...

*/

router.get('/', async (req, res) => {
    User.find({}, function (err, users) {
        if (err) {
            console.log('ERROR GET /users', err);
            return res.status(400).json({ error: err });
        }
        return res.status(200).json({ users });
    });
});

router.get('/feed', async (req, res) => {
    Moment.find({ public: true }, function (err, moments) {
        if (err) return res.status(400).json({ error: err });
        return res.status(200).json({ moments });
    });
});

module.exports = router;
