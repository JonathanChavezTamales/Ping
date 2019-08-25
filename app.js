const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}`,
  algorithms: ['RS256']
});

//Global middleware
app.use('/static', express.static('static'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

//Routes
const NGORoutes = require('./routes/NGO/index.js');
const UserRoutes = require('./routes/User/index.js');
const EventRoutes = require('./routes/Event/index.js');

app.get('/postre', checkJwt, (req, res) => {
  res.json({ hola: '234' });
});
app.use('/ngo/', NGORoutes);
app.use('/user/', UserRoutes);
app.use('/event/', EventRoutes);

//Errors

//When reaches here it means that did not enter on any of the urls above
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  //Passes this data to the next middleware
  next(error);
});

//Handles any error thrown
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: error.status
    }
  });
});

module.exports = app;
