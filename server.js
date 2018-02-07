var express = require('express');
var ElectrumCli = require('electrum-client')
var app = express();


app.get('/balance/:ticker/:address', function(req, res) {
  let ticker = req.params.ticker
  let address = req.params.address

  res.send([{name:'wine1'***REMOVED***, {name:'wine2'***REMOVED***]);
***REMOVED***);
app.get('/wines/:id', function(req, res) {
   res.send({id:req.params.id, name: "The Name", description: "description"***REMOVED***);
***REMOVED***);

app.listen(3000);
console.log('Listening on port 3000...');