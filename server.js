var connect = require('connect'),
    modRewrite = require('connect-modrewrite'),
    send = require('send');

var twoHours = 1000 * 60 * 60 * 2,
    oneMonth = 1000 * 60 * 60 * 24 * 30;

function myStatic(req, res) {
  var htmlPathRegex = /^(\/?|.*\.html)$/;
      isHtml = htmlPathRegex.test(req.url),
      maxage = isHtml ? twoHours : oneMonth;

  send(req, req.url)
    .maxage(maxage)
    .root('public')
    .pipe(res);
}

exports.startServer = function(port, path, afterStart) {
  var app = connect()
    .use(modRewrite([
      '!^/assets/ /index.html'
    ]))
    .use(connect.compress())
    .use(myStatic)
    .listen(port);

  if (afterStart) {
    afterStart();
  }

  return app;
};

if (require.main === module) {
  var port = process.env.PORT || 3333;

  exports.startServer(port, '', function() {
    console.log('application started on http://localhost:' + port + '/');
  });
}
