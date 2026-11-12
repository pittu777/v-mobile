
const mongoose = require("mongoose");
const connectDB = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to db ${mongoose.connection.host}`);
    }catch(error){
        console.log(`Error db ${error}`)
    }
};

module.exports = connectDB;