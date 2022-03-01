require('dotenv').config();
const express = require('express');
const cors = require("cors");
const app = express()
const port = process.env.PORT || 5000;
const { errorLog, errorHandlerNotify } = require("express-error-handle");
const dbConnect = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');
const searchRoutes = require('./routes/searchRoutes');
const productReviewRoutes = require('./routes/productReviewRoutes');
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send('app connected')
});
//db connected
dbConnect();
//main routes
app.use('/', userRoutes);
app.use('/', shopRoutes);
app.use('/', productRoutes);
app.use('/',productReviewRoutes)
app.use('/userLists',searchRoutes)
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

//handling error using at the end of last routes
app.use(errorLog);
app.use(errorHandlerNotify);
