Yoshinom.VenueItemController = Ember.ObjectController.extend
  formattedReview: (->
    "<p>#{@get('review').replace(/\n/g, '</p><p>')}</p>".htmlSafe()
  ).property('review')

  showRatings: (->
    return false if not @get('isImageLoaded')
    values = (value for own rating, value of @get('ratings'))
    values.some (value) -> value
  ).property('isImageLoaded', 'ratings')

Yoshinom.VenueItemView = Ember.View.extend
  didInsertElement: ->
    @_super()

    setImageLoaded = => @set 'controller.isImageLoaded', true

    handleCachedImages = ->
      if @complete
        $(@).load()

    @$('img').one 'load error', setImageLoaded
    .each handleCachedImages

  willDestroyElement: ->
    @_super()
    @$('img').off 'load error'

Yoshinom.VenueView = Ember.View.extend
  scrollToDirectLink: (->
    venue = @get('controller')
    return if not (venue.get('isDirectLink') and venue.get('areImagesLoaded'))

    venue.set 'isDirectLink', false
    Em.run.scheduleOnce 'afterRender', -> # why is this necessary?
      venue.set 'showDetails', true

    Em.run.scheduleOnce 'afterRender', @, '_scrollToId', venue.get('name')
  ).observes('controller.{isDirectLink,areImagesLoaded}')

  _scrollToId: (id) ->
    $element = $(document.getElementById(id))
    buffer = 32
    $('html, body').animate
      scrollTop: $element.offset().top - buffer
    , 1000

Yoshinom.VenueController = Ember.ObjectController.extend
  needs: ['sectionSort']

  areImagesLoaded: Em.computed.alias 'controllers.sectionSort.areImagesLoaded'
