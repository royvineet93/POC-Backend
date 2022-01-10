const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// Setup DB Connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Initiating DB Connection

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection successful'))
  .catch(() => console.log('Cannot connect to DB'));

//Server setup

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening to server @ ${port}...`);
});
