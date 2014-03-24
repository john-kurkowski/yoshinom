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

Yoshinom.SectionsLoadingRoute = Ember.Route.extend
  renderTemplate: ->
    @render 'app/templates/sections_loading'

Yoshinom.SectionRoute = Ember.Route.extend
  model: (params) ->
    confsPromise = switch params.section
      when 'westla'
        spreadsheetPromise(1).then (venues) ->
          confs = venues.filter (venue) ->
            venue.tags?.contains 'West-LA'
          sorts = ['food', 'service', 'atmosphere', 'uniqueness', 'bathroom']
          [confs, sorts]
      when 'cocktails'
        spreadsheetPromise(2).then (cocktails) ->
          sorts = ['whiskey', 'gin']
          sorts = ['whiskey', 'rum']
          [cocktails, sorts]

    if not confsPromise
      return @transitionTo 'fourOhFour' # TODO

    confsPromise.then ([venueConfs, sorts]) =>
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

parseSpreadsheetEntry = (entry) ->
  gsxRegex = /^gsx\$/
  keys = Em.keys(entry).filter (key) -> gsxRegex.test(key)
  keys.reduce (acc, key) ->
    normalizedKey = key.replace gsxRegex, ''
    text = entry[key]['$t']
    acc[normalizedKey] = switch normalizedKey
      when 'images' then text.split /\s+/
      when 'tags' then text.split /,\s+/
      else text
    acc
  , {}

spreadsheetPromise = (sheet) ->
  $.ajax
    url: "https://spreadsheets.google.com/feeds/list/0AqhwsCsZYnVDdHBnMTBuUjFWRVNnZFo4V2xtRW5HLUE/#{sheet}/public/values"
    dataType: 'jsonp'
    data:
      alt: 'json'
    cache: true
  .then (spreadsheet) ->
    spreadsheet.feed.entry.map parseSpreadsheetEntry

parseVenuePromise = (venue) ->
  venue.ratings =
    food: venue.food
    service: venue.service
    atmosphere: venue.atmosphere
    uniqueness: venue.uniqueness
    bathroom: venue.bathroom

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
