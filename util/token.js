// jsonwebtoken

const jwt = require('jsonwebtoken')

// to generate login token

const createAccessToken = (userid) => {
    // jwt.sign(id, secret, optionals) expiresIn = 60, "2 days", "10h"
    return jwt.sign(userid, process.env.ACCESS_SECRET, {expiresIn:'1d'})
}
module.exports = createAccessToken