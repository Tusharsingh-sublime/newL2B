const mongoose = require('mongoose');

// MongoDB connection string
const uri = 'mongodb://localhost:27017/newL2B'; // Change "mydatabase" to your database name

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
          });
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  };

module.exports = connectDB;
