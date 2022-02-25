const mongoose = require('mongoose');
const dbConnect = async (req, res) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/soilight');
        console.log('db connection successfully')
    }
    catch (error) {
        console.error(error.message)
    }
}
module.exports = dbConnect;