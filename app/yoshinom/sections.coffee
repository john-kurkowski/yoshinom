require 'templates/sections'
require 'templates/sections_loading'
require 'templates/section'
require 'templates/section_sort'

Yoshinom.SectionsView = Ember.View.extend
  templateName: 'app/templates/sections'

Yoshinom.SectionFilterView = Ember.View.extend
  templateName: 'app/templates/section'

Yoshinom.SectionFilterSortView = Ember.View.extend
  templateName: 'app/templates/section_sort'

Yoshinom.SectionFilterSortController = Ember.ArrayController.extend
  areImagesLoaded: (->
    @every (item) -> item.get('isImageLoaded')
  ).property('content.@each.isImageLoaded')

  actions:
    toggleVenue: (venue) ->
      venue.toggleProperty 'showDetails'
      @forEach (otherVenue) ->
        if otherVenue.get('name') isnt venue.get('name')
          otherVenue.set 'showDetails', false

      true
