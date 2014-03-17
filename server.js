var connect = require('connect'),
    modRewrite = require('connect-modrewrite');

var staticMaxAge = 1000 * 60 * 60 * 2,
    app;

app = connect()
  .use(modRewrite([
    '!^/assets/ /index.html'
  ]))
  .use(connect.compress())
  .use(connect.static('public', { maxAge: staticMaxAge }))
  .listen(process.env.PORT || 3000);
