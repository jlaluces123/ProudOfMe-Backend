if (process.env.NODE_ENV !== 'production') {
    let dotenv = require('dotenv');
    const envFound = dotenv.config();
    if (envFound.error) throw new Error('Could not find .env file');
}

module.exports = {
    port: process.env.PORT || 3388,
    mongo_uri: process.env.MONGO_URI,
    google_secret: process.env.GOOGLE_SECRET,
    google_id: process.env.GOOGLE_ID,
};
