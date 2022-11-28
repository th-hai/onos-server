// Call in installed dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const router = require('./routes/index');

require('dotenv').config()
// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use(cors({origin: true})); // include before other routes


app.use('/api/', router);

const MONGOURL = process.env.MONGO_URL;
// set up port number
mongoose.connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Database connected');
  })
  .catch((error)=> {
    console.log('Error connecting to database');
  });

const port = process.env.PORT || 3000;
// set up home route
app.get('/', (request, respond) => {
  respond.status(200).json({
    message: 'Welcome to Onos',
  });
});

app.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});