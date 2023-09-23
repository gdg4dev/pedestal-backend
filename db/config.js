const mongoose = require('mongoose');

// Replace with your MongoDB Atlas connection string
const mongoURI = process.env.mongoURI;


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,   })   
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));
// Connect to MongoDB Atlas
