const express = require('express');
const Router = express.Router();
const { session, driver } = require('../../config/db/neo4j');

//Rutas
Router.post('/', (req, res) => {
  session
    .run('CREATE (n:Person {name:$name, events:[], friends:[]}) RETURN n', {
      name: req.body.name
    })
    .then(result => {
      driver.close();
      res.json(result);
    })
    .catch(e => {
      console.log(e);
      res
        .status(500)
        .json(e)
        .end();
    });
});

Router.get('/', (req, res) => {
  session
    .run('MATCH (n:Person) RETURN n LIMIT 100')
    .then(result => {
      driver.close();
      res.json(result.records[0].get(0).properties);
    })
    .catch(e => {
      console.log(e);
      res
        .status(500)
        .json(e)
        .end();
    });
});

module.exports = Router;
