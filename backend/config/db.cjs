/* eslint-disable no-undef */
const mongoose = require("mongoose");

//defines asyncronous function with variable connectDB named, it is responsible for connecting to MongoDB.
const connectDB = async () => {
  //inside try block
  try {
    //conn awaits to connect to mongoose. attempts to establish connection to mongodb. the "process.env.MONGO_URI" has it's connection environment which means, it calls the secret key from .env file and you can see it there for more information,
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, //this option is from mongoose ensuring new URL.
      useUnifiedTopology: true, //this option enables new server to monitor.
      retryWrites: true, // Ensure this is a boolean in the code.
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};
module.exports = connectDB;
