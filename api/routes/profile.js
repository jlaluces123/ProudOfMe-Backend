const router = require('express').Router();
const User = require('../../models/User');
const Moment = require('../../models/Moment');
const mongoose = require('mongoose');

router.get('/:userId', async (req, res) => {
    console.log('GET /id');
    let userId = req.params.userId;
    await User.findOne({ googleId: userId }, (err, user) => {
        if (err) {
            console.log('ERROR GET /id', err);
            return res.status(400).json({ error: 'ERROR GETTING USER' });
        }
        console.log('User found, returning: ', user);
        return res.status(200).json({ user });
    });
});

router.get('/:userId/mantra', async (req, res) => {
    console.log('GET /id');
    let userId = req.params.userId;
    await User.findOne({ googleId: userId }, (err, user) => {
        if (err) {
            console.log('ERROR GET /id', err);
            res.status(400).json({ error: 'ERROR GETTING USER' });
        }
        console.log('User found, returning: ', user.mantra);
        res.status(200).json({ mantra: user.mantra });
    });
});

router.post('/:userId/mantra', async (req, res) => {
    console.log('POST /id/mantra');
    let userId = req.params.userId;

    await User.updateOne(
        { googleId: userId },
        {
            $set: { mantra: req.body.mantra },
        },
        (err, result) => {
            if (err) throw err;
            console.log(result);
        }
    );
});

/*
POST / CREATE - A Moment

! Current issue: casting userId from string to ObjectId

1. Gathers userId (req.params)
2. Gathers title and story (req.body)
3. Creates a Moment
*/
router.post('/:userId/moments', (req, res) => {
    console.log('POST /id/moments');
    let userId = req.params.userId;
    let title = req.body.title;
    let story = req.body.story;
    let public = req.body.public;

    User.find({ googleId: userId }, (err, user) => {
        if (err) return res.status(404).json(err);
        console.log('USER: ', user[0]._id);
        console.log(mongoose.Types.ObjectId.isValid(user[0]._id));

        let moment = new Moment({
            _id: mongoose.Types.ObjectId(),
            userId: user[0]._id,
            title,
            story,
            public,
        });

        moment
            .save()
            .then((data) => res.json(201).json(data))
            .catch((err) => res.status(400).json(err));
    });
});

/*
        GET - All Moments
    
        ! Current Issue: argument passed in must be 12 bytes or a string of 24 hex chars
    
        1. Finds all Moment documents that have the userId attached to it
        2. Returns all Moment documents back to client
    */
router.get('/:userId/moments', (req, res) => {
    console.log('GET /id/moments');
    let userId = req.params.userId;

    User.findOne({ googleId: userId }, (err, user) => {
        if (err) {
            console.log('Could not find user | GET Moments:', err);
            return res.status(400).json(err);
        }

        Moment.find({ userId: String(user._id) }, (err, moments) => {
            if (err) {
                console.log(
                    'Could not find moments | GET Moments findById: ',
                    err
                );
                return res.status(400).json(err);
            }

            console.log('SUCCESS - GET Moments');
            return res.status(200).json(moments);
        });
    });
});

module.exports = router;
