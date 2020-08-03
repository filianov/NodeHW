const User = require('./users.model');
const jwt = require("jsonwebtoken");

const authorize = async function (req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader.replace("Bearer ", "");

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).send("Not authorized");
    }

    const user = await User.findById(payload.id);

    req.user = user;

    next();
};

module.exports = { authorize };