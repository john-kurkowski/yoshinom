exports.config =
  files:
    javascripts:
      joinTo:
        'assets/app.js': /^app/
        'assets/vendor.js': /^(bower_components|vendor)/
    stylesheets:
      joinTo: 'assets/app.css'
    templates:
      joinTo: 'assets/app.js'

  angularTemplate:
    moduleName: 'yoshinom'
