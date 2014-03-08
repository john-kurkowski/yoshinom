yoshinom.directive 'yoshinomSortKeys', ($timeout) ->
  (scope, element, attrs) ->
    initIsotopeAfterDom = ->
      isotopeGetSortData = _.object(_.map(yoshinom.ratingClasses, (cls) ->
        getterForClass = ($elem) -> parseFloat($elem.find(".#{cls}").text())
        [cls, getterForClass]
      ))

      $('.venues').isotope
        getSortData: isotopeGetSortData

    $timeout initIsotopeAfterDom

yoshinom.directive 'yoshinomSortClass', ->
  (scope, element, attrs) ->
    element.bind 'click', ->
      $('.venues').isotope
        sortBy: attrs.yoshinomSortClass
        sortAscending: false
