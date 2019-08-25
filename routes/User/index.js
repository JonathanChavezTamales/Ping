const express = require('express');
const Router = express.Router();
//Rutas
Router.get('/test', (req, res) => {
  console.log('hola');
});

module.exports = Router;
