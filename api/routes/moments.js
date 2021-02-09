const router = require('express').Router();
const User = require('../../models/User');
const Moment = require('../../models/Moment');
const mongoose = require('mongoose');

/* 
    API URL: /api/moments/...
*/

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
    let momentId = req.params.momentId;
    let userId = req.body.userId;
    let action = req.body.action;

    if (action == 'like') {
        Moment.findOneAndUpdate(
            { _id: momentId },
            {
                $inc: { likes: 1 },
                $push: { usersWhoLiked: userId },
                function(err, success) {
                    if (err)
                        return res.status(400).json({ addLikesError: err });
                    if (success) return res.status(200).json({ success });
                },
            }
        );
    } else if (action == 'unlike') {
        Moment.findOneAndUpdate(
            { _id: momentId },
            {
                $inc: { likes: -1 },
                $pull: { usersWhoLiked: userId },
                function(err, success) {
                    if (err)
                        return res.status(400).json({ removeLikesError: err });
                    if (success) return res.status(200).json({ success });
                },
            }
        );
    } else {
        return res.status(400).json('No Action Found: please supply one');
    }
});

module.exports = router;
