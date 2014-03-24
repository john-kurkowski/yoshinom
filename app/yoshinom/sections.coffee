require 'templates/sections'
require 'templates/sections_loading'
require 'templates/section'
require 'templates/section_sort'

Yoshinom.SectionsView = Ember.View.extend
  templateName: 'app/templates/sections'

Yoshinom.SectionView = Ember.View.extend
  templateName: 'app/templates/section'

Yoshinom.SectionSortView = Ember.View.extend
  templateName: 'app/templates/section_sort'

Yoshinom.SectionSortController = Ember.ArrayController.extend
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
