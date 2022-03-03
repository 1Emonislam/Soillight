// const mongoose = require('mongoose');
// const dbConnect = async (req, res) => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/soilight');
//         console.log('db connection successfully')
//     }
//     catch (error) {
//         console.error(error.message)
//     }
// }
// module.exports = dbConnect;

  
const mongoose = require('mongoose')

const dbConnect = async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hmdql.mongodb.net/soilight?`
    try {
// const connectionDb = mongoose.connect('mongodb://localhost:27017/soilight');
        const connectionDb = await mongoose.connect(uri, {
            useNewUrlParser: true, useUnifiedTopology: true
        }
        );
        console.log(`MongoDB Successfully Connected`)
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit();
    }
}
module.exports = dbConnect;


// api
// https://soilight.herokuapp.com/