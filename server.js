'use strict'

var express = require('express');
var app = express();
var mcache = require('memory-cache');
console.log(mcache);
const port = process.env.PORT || 9080;

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key);
	console.log(req.originalUrl+"||||||||||||"+req.url);

	
	
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
		  
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

app.get('/', cache(10), (req, res) => {
	console.log(">>>>")
	
  setTimeout(() => {
    res.send({'index': { title: 'Hey', message: 'Hello there', date: new Date()}})
  }, 5000) //setTimeout was used to simulate a slow processing request
})

app.get('/user/:id', cache(10), (req, res) => {
  setTimeout(() => {
    if (req.params.id == 1) {
      res.json({ id: 1, name: "John"})
    } else if (req.params.id == 2) {
      res.json({ id: 2, name: "Bob"})
    } else if (req.params.id == 3) {
      res.json({ id: 3, name: "Stuart"})
    }
  }, 3000) //setTimeout was used to simulate a slow processing request
})

app.use((req, res) => {
  res.status(404).send('') //not found
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})