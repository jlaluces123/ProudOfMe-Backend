const router = require('express').Router();
const User = require('../../models/User');
const Moment = require('../../models/Moment');
const mongoose = require('mongoose');

/* 
    API URL: /api/moments/...
*/

router.get('/:momentId', async (req, res) => {
    let momentId = req.params.momentId;

    Moment.findOne({ _id: momentId }, (err, moment) => {
        if (err) return res.status(400).json({ fetchMomentErr: err });
        return res.status(200).json({ moment });
    });
});

/*
    POST (Likes)
    - This function will be called when users click the
    like button on any of the posts

    Components needed:
        1. MomentId (supplied via url)
        2. UserId (supplied via request body)
        3. Actino (supplied via request body) -- like || unlike

    This route:
        1. Finds the moment that was liked
        2. Increments the likes by 1
        3. Pushes the user into the liked array
        4. Returns status corresponding to result

*/

router.post('/:momentId/likes', async (req, res) => {
    console.log('POST Moments');
    let momentId = req.params.momentId;
    let userId = req.body.userId;
    let action = req.body.action;

    Moment.findOne({ _id: momentId }, (err, moment) => {
        if (err) return res.status(400).json({ checkIfUserLikedError: err });

        // If user is trying to like somehow even though they already liked:
        if (
            action == 'like' &&
            moment.usersWhoLiked.includes(userId) === true
        ) {
            console.log('User already in liked arr');
            return res
                .status(304)
                .json({ checkIfUserLiked: 'Found User already' });

            // User didn't like already and is liking the post
        } else if (action == 'like') {
            console.log('User is adding like');
            Moment.findOneAndUpdate(
                { _id: momentId },
                {
                    $inc: { likes: 1 },
                    $addToSet: { usersWhoLiked: userId },
                },
                { useFindAndModify: false, new: true },
                function (err, success) {
                    if (err) {
                        console.error(err);
                        return res.status(400).json({ addLikesError: err });
                    } else {
                        console.log(success);
                        return res
                            .status(201)
                            .json({ addLikesSuccess: success });
                    }
                }
            );

            // User is unliking
        } else if (action == 'unlike') {
            console.log('User is removing like');
            Moment.findOneAndUpdate(
                { _id: momentId },
                {
                    $inc: { likes: -1 },
                    $pull: { usersWhoLiked: userId },
                },
                { useFindAndModify: false, new: true },
                function (err, success) {
                    if (err) {
                        console.error(err);
                        return res.status(400).json({ removeLikesError: err });
                    } else {
                        console.log(success);
                        return res
                            .status(201)
                            .json({ removeLIkesSuccess: success });
                    }
                }
            );
        } else {
            console.log('No action found');
            return res.status(400).json('No Action Found: please supply one');
        }
    });
});

module.exports = router;
