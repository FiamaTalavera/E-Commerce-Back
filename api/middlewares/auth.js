const { validateToken } = require('../config/tokens.js')

function validateUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(401);
    }

    const { payload } = validateToken(token);
    req.user = {
        userId: payload.userId,
        ...payload
    };
    if (payload) {
        return next();
    } else {
        return res.sendStatus(401);
    }
}

module.exports = {validateUser}