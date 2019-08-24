const express = require('express');
const Router = express.Router();
//Rutas
const test = require('./test');

Router.get('/test', (req, res) => {
  test(req, res);
});

module.exports = Router;
