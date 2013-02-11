randRating = ->
  Math.floor(Math.random() * (5 - 1 + 1) + 1)

yoshinom = angular.module('yoshinom', [])

yoshinom.directive 'yoshinomSortKeys', ($timeout) ->
  (scope, element, attrs) ->
    initIsotopeAfterDom = ->
      sortClasses = element.find('[yoshinom-sort-class]').map ($elem) -> $(@).attr('yoshinom-sort-class')
      isotopeGetSortData = _.object(_.map(sortClasses, (cls) ->
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

ListCtrl = ($scope) ->
  $scope.venues = _.range(11).map (i) ->
    name: 'Pho So 1'
    image: "img/photo_#{i}.jpg"
    ratings:
      food: randRating()
      service: randRating()
      atmosphere: randRating()
      uniqueness: randRating()
      bathroom: randRating()
