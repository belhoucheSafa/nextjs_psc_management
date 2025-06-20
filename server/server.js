const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// DB CONNECTION
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅  DB CONNECTED SUCCESSFULLY !'))
  .catch(err => {
    console.error('❌ DB CONNECTION ERROR:', err);
    process.exit(1);
  });

// STARTING THE SERVER
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`✅ App running on port ${port}...`);
});

// EXTERNAL ERROR
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
