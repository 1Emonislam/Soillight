const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const socketServer = async () => {
	// Apply middlewares
	// io.use(wrap(auth));
	io.use(async (socket, next) => {
		const req = socket.request;
		const token = socket.handshake.auth.token;

		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				const user = await User.findOne({ _id: decoded.id }).select("-password");
				if (user) {
					req.user = user;
					next();
				} else {
					return next("Invalid token");
				}
			} catch (error) {
				return next(error);
			}
		} else {
			return next("no token!");
		}
	});

	// user connection
	io.use(async (socket, next) => {
		try {
			const user = socket.request.user;
			user.socketId = socket.id;
			// user.lastOnline = 1;
			await user.save();

			return next();
		} catch (error) {
			return next(error);
		}
	});

	io.on("connection", (socket) => {
		// You can do something like emitting an event hare.
		// I don't want to do anything when a new user is connect there.

		socket.on("disconnect", async () => {
			const user = socket.request.user;

			const currentEpochTime = Date.now();

			user.socketId = null;
			user.lastOnline = currentEpochTime;

			await user.save();
		});
	});
};

module.exports = socketServer;
