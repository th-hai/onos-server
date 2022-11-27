// Call in installed dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const router = require('./routes/index');


// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

// enable cors
app.use(cors());

app.use('/api/', router);

// set up port number
mongoose.connect('mongodb://dbUser:LAXiwJt8AyEdYg0h@cluster0-shard-00-00.wnl9y.mongodb.net:27017/Onos?ssl=true&replicaSet=atlas-of48xc-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
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
    message: 'Welcome to Project Support',
  });
});


app.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});