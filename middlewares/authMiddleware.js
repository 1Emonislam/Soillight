const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const protect = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization?.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			if (!token) {
				return res.status(400).json({ error: { token: "no token!" } });
			}
			// console.log(token)
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({ _id: decoded.id }).select("-password");
			if (user.action === 'inactive') {
				return res.status(400).json({ error: { action: 'Your account has been temporarily inactive. contact customer support' } })
			}
			if (user.action === 'block') {
				return res.status(400).json({ error: { action: 'Your account has been temporarily blocked.' } })
			}
			if (user.action === 'closed') {
				return res.status(400).json({ error: { action: 'Your account has been temporarily closed.' } })
			}
			// console.log(user)
			req.user = user;
			next();
		} catch (error) {
			return res.status(401).json({ error: { token: "not authorized token failed!" } });
		}
	} else {
		console.log("Hey");
		console.log(token)
		return res.status(400).json({ error: { token: "no token!" } });
	}
};
module.exports = { protect };
