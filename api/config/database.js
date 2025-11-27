const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/analytics';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDatabase;