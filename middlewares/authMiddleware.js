const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(400).json({ error: { "token": "no token!" } })
            }
            // console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.id }).select("-password");
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ error: { "token": "not authorized token failed!" } });
        }
    } else {
        return res.status(400).json({ error: { "token": "no token!" } })
    }
}
module.exports = { protect }