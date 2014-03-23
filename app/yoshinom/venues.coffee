Yoshinom.VenuePresentationController = Ember.ObjectController.extend
  formattedReview: (->
    "<p>#{@get('review').replace(/\n/g, '</p><p>')}</p>".htmlSafe()
  ).property('review')

  showRatings: (->
    values = (value for own rating, value of @get('ratings'))
    values.some (value) -> value
  ).property('ratings')

Yoshinom.VenueView = Ember.View.extend
  scrollToDirectLink: (->
    venue = @get('controller')
    return if not venue.get('isDirectLink')

    venue.set 'isDirectLink', false
    Em.run.scheduleOnce 'afterRender', -> # why is this necessary?
      venue.set 'showDetails', true

    Em.run.scheduleOnce 'afterRender', @, '_scrollToId', venue.get('name')
  ).observes('controller.isDirectLink')

  _scrollToId: (id) ->
    $element = $(document.getElementById(id))
    buffer = 32
    $('html, body').animate
      scrollTop: $element.offset().top - buffer
    , 1000
