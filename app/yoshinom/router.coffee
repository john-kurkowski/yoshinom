Yoshinom.Router.map ->
  @resource 'sections', { path: '/' }, ->
    @resource 'section', { path: '/:section' }, ->
      @resource 'section.sort', { path: '/:sort' }, ->
        @resource 'venue', { path: '/:venue' }

Yoshinom.Router.reopen
  location: 'history'

Yoshinom.SectionsIndexRoute = Ember.Route.extend
  beforeModel: ->
    @transitionTo 'section.sort', 'westla', 'food' # the only one we got

Yoshinom.SectionRoute = Ember.Route.extend
  model: (params) ->
    venueConfs = switch params.section
      when 'westla' then require('yoshinom/reviews').venues

    if not venueConfs
      return @transitionTo 'fourOhFour' # TODO

    venuePromises = venueConfs.map parseVenuePromise
    Ember.RSVP.all(venuePromises).then (venues) -> Ember.Object.create
      section: params.section
      venues: venues

Yoshinom.SectionSortRoute = Ember.Route.extend
  setupController: (controller, model) ->
    sorts = ['food', 'service', 'atmosphere', 'uniqueness', 'bathroom']
    if sorts.contains model.sort
      sorts.unshift model.sort

    controller.setProperties
      content: @modelFor('section').get('venues')
      sortProperties: sorts.map (sort) -> "ratings.#{sort}"
      sortAscending: false

parseVenuePromise = (venue) ->
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
    promise = $.ajax
      url: 'http://api.instagram.com/oembed'
      dataType: 'jsonp',
      data:
        url: firstImage
        maxwidth: 500
      cache: true


    promise.then (data) ->
      venue.image = data.url
      Ember.Object.create(venue)

  else
    venue.image = firstImage
    Ember.RSVP.resolve Ember.Object.create(venue)
