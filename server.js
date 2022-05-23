require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server, Socket } = require("socket.io");
const app = express();
const serverApp = http.createServer(app);
// Socket Server
const io = new Server(serverApp, {
	pingTimeout: 60000,
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT"],
	},
});
global.io = io;

// socket server binding
// const socketServer = require("./socket/server");
// socketServer();
const port = process.env.PORT || 7000;
const { errorLog, errorHandlerNotify } = require("express-error-handle");
const dbConnect = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const searchRoutes = require("./routes/searchRoutes");
const productReviewRoutes = require("./routes/productReviewRoutes");
const productSearchRoutes = require("./routes/productSearchRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const bankLinkedRoutes = require('./routes/bankLinkedRoutes');
const balanceWithdrawRoutes = require('./routes/balanceWithdrawRoutes');
const balanceHistoryRoutes = require('./routes/balanceHistoryRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const buyerRiderReviewRoutes = require('./routes/buyerRiderReviewsRoutes')
const User = require("./models/userModel");
const categoryCollectionRoutes = require("./routes/categoryCollectionRoutes")
const Notification = require("./models/notificationMdels");
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/socket/client/index.html")
});
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
	extended: false, limit: '50mb', parameterLimit: 100000,
	extended: true
}))
app.use(bodyParser.json({ limit: '50mb' }))
//Notification Models
//db connected
dbConnect();
//main routes
app.use("/", userRoutes);
app.use("/", shopRoutes);
app.use("/", productRoutes);
app.use("/", productReviewRoutes);
app.use("/", searchRoutes);
app.use("/", productSearchRoutes);
app.use("/", cartRoutes);
app.use("/", orderRoutes);
app.use('/', bankLinkedRoutes)
app.use('/', balanceWithdrawRoutes)
app.use('/', balanceHistoryRoutes)
app.use('/', subscriptionRoutes)
app.use('/', categoryCollectionRoutes)
app.use('/', notificationRoutes);
app.use('/', buyerRiderReviewRoutes)
serverApp.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
// const socketServer = require("./socket/server");
// socketServer();
app.get('/',(req,res) =>{
	res.send("server connected")
})
io.on('connection', async (socket) => {
	console.log('user connected')
	io.use(async (socket, next) => {
		const req = socket.request;
		const token = socket.handshake.auth.token;
		// console.log(token)
		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				const user = await User.findOne({ _id: decoded.id }).select("-password");
				// console.log(user)
				if (user) {
					req.user = user;
					// console.log(req.user)
					next();
				} else {
					req.user = null
					return next("Invalid token");
				}
			} catch (error) {
				req.user = null
				return next(error);
			}
		} else {
			req.user = null
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

	io.use(async (socket, next) => {
		try {
			const lastWeek = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
			const today = new Date();
			const notificationToday = await Notification.find({ timestamp: { $gte: today }, receiver: socket.request?.user?._id });
			const notificationLastWeak = await Notification.find({ timestamp: { $gte: lastWeek }, receiver: socket.request?.user?._id });
			const notificationObj = { today: { todayDate: today, data: notificationToday }, lastWeek: { lastWeekDate: lastWeek, data: notificationLastWeak } };
			socket.emit("my notification", { data: notificationObj })
		}
		catch (error) {
			next(error)
		}
	})

	socket.on("disconnect", async () => {
		console.log('user disconnected')
		const user = socket.request.user;
		const currentEpochTime = Date.now();
		if (user) {
			user.socketId = null;
			console.log(currentEpochTime)
			user.lastOnline = currentEpochTime;
			await user.save();
		} else {
			console.log('user not found')
		}
	});
});
//handling error using at the end of last routes
app.use(errorLog);
app.use(errorHandlerNotify);
