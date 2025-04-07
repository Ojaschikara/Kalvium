const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL) // No need for useNewUrlParser or useUnifiedTopology
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
      console.log("mongodb Data",data.Collection)
      // console.log(data.Collection.find)
      // console.log(mongoose.connection.collections);
    })
    .catch((err) => {
      console.error(`Database connection failed: ${err}`);
      process.exit(1); // Exit process to avoid running with an invalid DB connection
    });
};

module.exports = connectDatabase;
