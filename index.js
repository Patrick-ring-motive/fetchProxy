


var fetch = require('node-fetch');
var http = require('http');

var hostTarget='www.google.com';

http.createServer(onRequest).listen(3000);

async function onRequest(req, res) {
  req.headers.host = hostTarget;
  req.headers.referer = hostTarget;

  const options = {
    method: req.method,
    headers: req.headers
  };

  let response = await fetch('https://' + hostTarget + req.url, options);

  res.headers = response.headers;

  let ct = response.headers.get('content-type');
  if ((ct) && (ct.indexOf('image') == -1)) {
    let body = await response.text();
    res.end(body);
  } else {

    res.setHeader('location', 'https://' + hostTarget  + req.url);

    res.statusCode = 302;
    res.end();
  }
}