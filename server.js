var connect = require('connect'),
    modRewrite = require('connect-modrewrite');

var staticMaxAge = 1000 * 60 * 60 * 2;

exports.startServer = function(port, path, afterStart) {
  var app = connect()
    .use(modRewrite([
      '!^/assets/ /index.html'
    ]))
    .use(connect.compress())
    .use(connect.static('public', { maxAge: staticMaxAge }))
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
