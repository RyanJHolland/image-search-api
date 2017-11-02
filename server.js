// %%%%%%% SETUP %%%%%%%%
const express = require('express');
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);
const app = express();
app.use(express.static('public'));

// %%%%%%% STORAGE %%%%%%%
var lastTen = [];
const logSearch = function(query, time) {
  lastTen.push({query, time});
  if (lastTen.length > 10) {
    lastTen.shift();
  }
};

// %%%%%%% ROUTING %%%%%%%
app.get("/api/imagesearch/:searchQuery", function (request, response) {
  if (request.query.offset) {
      var offset = encodeURIComponent(request.query.offset);
  };
  var query = encodeURIComponent(request.params.searchQuery);
  logSearch(query, Date.now());
  var results = client.search(query, {page: offset})
    .then((res) => {
      response.send(res);
    });
});

app.get("/api/latest/imagesearch", function (request, response) {
  response.send(lastTen);
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
