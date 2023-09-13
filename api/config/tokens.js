const jwt = require("jsonwebtoken")


function generateToken(payload) {
    const token = jwt.sign({ payload }, process.env.SECRET, {
        expiresIn: '2d',
    });
    return token;
}

function validateToken(token) {
    return jwt.verify(token, process.env.SECRET);
}

module.exports = {generateToken, validateToken}