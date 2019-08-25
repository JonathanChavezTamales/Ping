const express = require('express');
const Router = express.Router();
const { session, driver } = require('../../config/db/neo4j');

//Rutas
Router.post('/', (req, res) => {
  session
    .run('CREATE (o:NGO {name:$name, image:$imageUrl}) RETURN o;', {
      name: req.body.name,
      imageUrl: req.body.imageUrl
    })
    .then(result => {
      driver.close();
      res.json(result.records[0].get(0));
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
    .run('MATCH (o:NGO) RETURN o LIMIT 30')
    .then(result => {
      driver.close();
      payload = [];
      result.records.forEach(r => {
        console.log(r);
        payload.push(r.get(0));
      });
      res.json({ payload });
    })
    .catch(e => {
      console.log(e);
      res
        .status(500)
        .json(e)
        .end();
    });
});

Router.get('/:id', (req, res) => {
  session
    .run(`MATCH (o:NGO) WHERE id(o)=${req.params.id} RETURN o;`)
    .then(result => {
      driver.close();
      res.json(result.records[0].get(0));
    })
    .catch(e => {
      console.log(e);
      res
        .status(500)
        .json(e)
        .end();
    });
});

Router.get('/:id/events', (req, res) => {
  session
    .run(
      `MATCH (o:NGO)-[r:ORGANIZES]->(e:Event) WHERE id(o)=${req.params.id} RETURN id(e);`
    )
    .then(result => {
      driver.close();
      payload = [];
      result.records.forEach(r => {
        payload.push(r.get(0));
      });
      res.json({ payload });
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
