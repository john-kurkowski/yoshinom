#!/usr/bin/env node

var compression = require('compression');
var connect     = require('connect');
var modRewrite  = require('connect-modrewrite');
var send        = require('send');

var twoHours = 1000 * 60 * 60 * 2;
var oneMonth = 1000 * 60 * 60 * 24 * 30;

function myStatic(req, res) {
  var htmlPathRegex = /^(\/?|.*\.html)$/;
  var isHtml = htmlPathRegex.test(req.url);
  var maxage = isHtml ? twoHours : oneMonth;

  send(req, req.url, {
    maxage: maxage,
    root: 'dist'
  })
  .pipe(res);
}

exports.startServer = function(port, path, afterStart) {
  var app = connect()
    .use(modRewrite([
      '!^/assets/ /index.html'
    ]))
    .use(compression())
    .use(myStatic)
    .listen(port);

  if (afterStart) {
    afterStart();
  }

  return app;
};

function main() {
  var port = process.env.PORT || 3333;

  exports.startServer(port, '', function() {
    console.log('application started on http://localhost:' + port + '/');
  });
}

if (require.main === module) {
  main();
}
