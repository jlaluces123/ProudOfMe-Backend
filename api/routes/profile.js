const router = require('express').Router();
const User = require('../../models/User');

router.get('/:userId', async (req, res) => {
    console.log('GET /id');
    let userId = req.params.userId;
    await User.find({ googleId: userId }, (err, user) => {
        if (err) {
            console.log('ERROR GET /id', err);
            res.status(400).json({ error: 'ERROR GETTING USER' });
        }
        console.log('User found, returning: ', user);
        res.status(200).json({ user });
    });
});

router.post('/:userId/mantra', async (req, res) => {
    console.log('POST /id/mantra');
});

module.exports = router;
