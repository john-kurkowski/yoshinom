ratingClasses = ['food', 'service', 'atmosphere', 'uniqueness', 'bathroom']

yoshinom = angular.module('yoshinom', [])

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
      templateUrl: 'list.html'

ListCtrl = ($scope, $http) ->
  $scope.ratingClasses = ratingClasses

  $http
    .get('yoshinom.yaml')
    .success (data, status, headers, config) ->
      db = jsyaml.load(data)
      $scope.venues = _.map db.venues, (venueConf) ->
        venue =
          name: venueConf.name
          ratings:
            food: venueConf.ratings[0]
            service: venueConf.ratings[1]
            atmosphere: venueConf.ratings[2]
            uniqueness: venueConf.ratings[3]
            bathroom: venueConf.ratings[4]

        firstImage = venueConf.images[0]
        isInstagramShortlink = firstImage.indexOf('http://instagr.am') isnt -1
        if isInstagramShortlink
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
