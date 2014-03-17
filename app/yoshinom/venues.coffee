Yoshinom.VenueController = Ember.ObjectController.extend
  formattedReview: (->
    "<p>#{@get('review').replace('\n', '</p><p>')}</p>".htmlSafe()
  ).property('review')
