


var fetch = require('node-fetch');
var http = require('http');

var hostTarget = 'www.google.com';

http.createServer(onRequest).listen(3000);

async function onRequest(req, res) {
  req.headers.host = hostTarget;
  req.headers.referer = hostTarget;



  /* start reading the body of the request*/
  var bdy = "";
  req.on('readable', function() {
    bdy += req.read();
  });
  req.on('end', async function() {
    /* finish reading the body of the request*/

    /* start copying over the other parts of the request */
    let options = {
      method: req.method,
      headers: req.headers
    };
    /* fetch throws an error if you send a body with a GET request even if it is empty */
    if ((req.method != 'GET') && (req.method != 'HEAD') && (bdy.length > 0)) {
      options = {
        method: req.method,
        headers: req.headers,
        body: bdy
      };
    }
    /* finish copying over the other parts of the request */

    /* fetch from your desired target */
    let response = await fetch('https://' + hostTarget + req.url, options);

    /* copy over response headers 

    
    */


    res.headers = response.headers;

    /* check to see if the response is not a text format */
    let ct = response.headers.get('content-type');

    if ((ct) && (ct.indexOf('image') == -1) && (ct.indexOf('video') == -1) && (ct.indexOf('audio') == -1)) {

      /* Copy over target response and return */
      let resBody = await response.text();
      res.end(resBody);


    } else {

      /* if not a text response then redirect straight to target */
      res.setHeader('location', 'https://' + hostTarget + req.url);
      res.statusCode = 302;
      res.end();

    }
  });


}