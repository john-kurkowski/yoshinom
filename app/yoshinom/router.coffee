Yoshinom.Router.map ->
  @resource 'sections', { path: '/' }, ->
    @resource 'section', { path: '/:section' }, ->
      @resource 'section.sort', { path: '/:sort' }, ->
        @resource 'venue', { path: '/:name' }

Yoshinom.Router.reopen
  location: 'history'

Yoshinom.SectionsIndexRoute = Ember.Route.extend
  beforeModel: ->
    @replaceWith 'section.sort', 'westla', 'food' # the only one we got

Yoshinom.SectionRoute = Ember.Route.extend
  model: (params) ->
    [venueConfs, sorts] = switch params.section
      when 'westla'
        confs = require('yoshinom/reviews').venues.filter (venue) ->
          venue.tags?.contains 'West-LA'
        sorts = ['food', 'service', 'atmosphere', 'uniqueness', 'bathroom']
        [confs, sorts]
      when 'cocktails'
        confs = require('yoshinom/reviews').cocktails
        sorts = ['whiskey', 'rum']
        [confs, sorts]

    if not venueConfs
      return @transitionTo 'fourOhFour' # TODO

    venuePromises = venueConfs.map parseVenuePromise
    Ember.RSVP.all(venuePromises).then (venues) -> Ember.Object.create
      section: params.section
      venues: venues
      sorts: sorts

Yoshinom.SectionSortRoute = Ember.Route.extend
  setupController: (controller, model) ->
    parentModel = @modelFor('section')

    sorts = Em.copy parentModel.get('sorts')
    if sorts.contains model.sort
      sorts.unshift model.sort

    controller.setProperties
      content: parentModel.get('venues')
      sortProperties: sorts.map (sort) -> "ratings.#{sort}" # TODO: this won't sort by tag
      sortAscending: false

  actions:
    toggleVenue: (venue) ->
      if venue.get('showDetails')
        @transitionTo 'venue', venue

Yoshinom.VenueRoute = Ember.Route.extend
  model: (params) ->
    name = decodeURIComponent(params.name)
    model = @modelFor('section').get('venues').findBy 'name', name
    if not model
      return @transitionTo 'fourOhFour' # TODO

    model.set 'isDirectLink', true
    model

  actions:
    toggleVenue: (venue) ->
      if not venue.get('showDetails')
        @transitionTo 'section.sort'
      true

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
        maxwidth: 800
      cache: true


    promise.then (data) ->
      venue.image = data.url
      Ember.Object.create(venue)

  else
    venue.image = firstImage
    Ember.RSVP.resolve Ember.Object.create(venue)
