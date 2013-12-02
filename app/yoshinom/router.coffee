ratingClasses = ['food', 'service', 'atmosphere', 'uniqueness', 'bathroom']

yoshinom = angular.module('yoshinom', ['ngRoute'])

yoshinom.directive 'yoshinomSortKeys', ($timeout) ->
  (scope, element, attrs) ->
    initIsotopeAfterDom = ->
      isotopeGetSortData = _.object(_.map(ratingClasses, (cls) ->
        getterForClass = ($elem) -> parseFloat($elem.find(".#{cls}").text())
        [cls, getterForClass]
      ))

      $('.venues').isotope
        getSortData: isotopeGetSortData

    $timeout initIsotopeAfterDom

yoshinom.directive 'yoshinomSortClass', ->
  (scope, element, attrs) ->
    element.click ->
      $('.venues').isotope
        sortBy: attrs.yoshinomSortClass
        sortAscending: false

yoshinom.config ($routeProvider) ->
  $routeProvider
    .when '/',
      redirectTo: '/series/venice' # TODO
    .when '/series/venice',
      controller: ListCtrl
      templateUrl: 'yoshinom/templates/list.html'

ListCtrl = ($scope, $http) ->
  $scope.ratingClasses = ratingClasses

  reviews = require 'yoshinom/reviews'
  $scope.venues = _.map reviews.venues, (venue) ->
    venue.ratings =
      food: venue.ratings[0]
      service: venue.ratings[1]
      atmosphere: venue.ratings[2]
      uniqueness: venue.ratings[3]
      bathroom: venue.ratings[4]

    firstImage = venue.images[0]
    isInstagramShortlink = firstImage.indexOf('http://instagr.am') isnt -1
    if isInstagramShortlink
      venue.imageLink = firstImage

      # can't use $http due to https://github.com/angular/angular.js/issues/1551
      $.ajax
        url: 'http://api.instagram.com/oembed'
        dataType: 'jsonp',
        data:
          url: firstImage
          maxwidth: 500
        cache: true
        success: (data, textStatus, jqXHR) ->
          venue.image = data.url
          $scope.$apply()

    else
      venue.image = firstImage

    venue
