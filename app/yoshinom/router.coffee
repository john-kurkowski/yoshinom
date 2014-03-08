controllers = require 'yoshinom/controllers'

yoshinom.config ($routeProvider, $locationProvider) ->
  $locationProvider.html5Mode(true)
  $routeProvider
    .when '/',
      redirectTo: '/series/venice' # TODO
    .when '/series/venice',
      controller: controllers.ListCtrl
      templateUrl: 'yoshinom/templates/list.html'
