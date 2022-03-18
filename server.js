require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const app = express();

const server = http.createServer(app);
// Socket Server
const io = socketIO(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT"],
	},
});
global.io = io;

// socket server binding
const socketServer = require("./socket/server");
socketServer();

const port = process.env.PORT || 5000;
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
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
	res.send("app connected");
});

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
server.listen(port, () => {
	console.log(`app listening on port ${port}`);
});

//handling error using at the end of last routes
app.use(errorLog);
app.use(errorHandlerNotify);
