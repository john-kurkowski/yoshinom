Yoshinom.Router.map ->
  @resource 'sections', { path: '/' }, ->
    @resource 'section', { path: '/:section' }, ->
      @resource 'section.filter', { path: '/:filter' }, ->
        @resource 'section.filter.sort', { path: '/:sort' }, ->
          @resource 'venue', { path: '/:name' }

Yoshinom.Router.reopen
  location: 'history'

Yoshinom.SectionsIndexRoute = Ember.Route.extend
  beforeModel: ->
    @replaceWith 'section.filter.sort', 'food', 'westla', 'food'

Yoshinom.SectionsLoadingRoute = Ember.Route.extend
  renderTemplate: ->
    @render 'app/templates/sections_loading'

Yoshinom.SectionRoute = Ember.Route.extend
  model: (params) ->
    [confsPromise, sorts] = switch params.section
      when 'food'
        sorts = ['food', 'service', 'atmosphere', 'uniqueness', 'bathroom']
        [spreadsheetPromise(1), sorts]
      when 'cocktails'
        sorts = ['whiskey', 'gin']
        [spreadsheetPromise(2), sorts]
      else
        []

    if not confsPromise
      return @transitionTo 'fourOhFour' # TODO

    confsPromise.then (confs) ->
      Ember.RSVP.all(confs.map parseVenuePromise).then (confs) -> Ember.Object.create
        section: params.section
        records: confs
        sorts: sorts

Yoshinom.SectionFilterRoute = Ember.Route.extend
  model: (params) ->
    parentModel = @modelFor('section')
    Ember.Object.create
      section: parentModel.get('section')
      sorts: parentModel.get('sorts')
      filter: params.filter
      records: switch params.filter
        when 'all' then parentModel.get('records')
        when 'westla' then parentModel.get('records').filter (venue) -> # TODO: it doesn't make sense to filter cocktail recipes by 'West-LA'
          venue.tags?.contains 'West-LA'

Yoshinom.SectionFilterSortRoute = Ember.Route.extend
  setupController: (controller, model) ->
    parentModel = @modelFor('section.filter')

    sorts = Em.copy parentModel.get('sorts')
    if sorts.contains model.sort
      sorts.unshift model.sort

    controller.setProperties
      content: parentModel.get('records')
      sortProperties: sorts.map (sort) -> "ratings.#{sort}" # TODO: this won't sort by tag
      sortAscending: false

  actions:
    toggleVenue: (venue) ->
      if venue.get('showDetails')
        @transitionTo 'venue', venue

Yoshinom.VenueRoute = Ember.Route.extend
  model: (params) ->
    name = decodeURIComponent(params.name)
    model = @modelFor('section').get('records').findBy 'name', name
    if not model
      return @transitionTo 'fourOhFour' # TODO

    model.set 'isDirectLink', true
    model

  actions:
    toggleVenue: (venue) ->
      if not venue.get('showDetails')
        @transitionTo 'section.filter.sort'
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
