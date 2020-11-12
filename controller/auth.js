// let userService = require('userService.js');

/*
    1. FindOrCreate User based on google id
*/
exports.signIn = async function (req, res, next) {
    console.log('/Sign in');
};

/*
    1. Read user id
    2. Check if id is valid (success: send data || fail: send error message)
*/
exports.getSingleUser = async function (req, res, next) {
    // Validate req params
    let id = req.params.id ? req.params.id : null;
    if (!id) res.status(404).json({ message: 'Could Not Find User_ID' });

    try {
        // let user = await userService.getSingleUser(id)
        return res
            .status(200)
            .json({ data: user, message: 'Successfully found User' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
