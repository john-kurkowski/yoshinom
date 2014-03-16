require 'templates/sections'
require 'templates/section'
require 'templates/section_sort'

Yoshinom.SectionsView = Ember.View.extend
  templateName: 'app/templates/sections'

Yoshinom.SectionView = Ember.View.extend
  templateName: 'app/templates/section'

Yoshinom.SectionSortView = Ember.View.extend
  templateName: 'app/templates/section_sort'

Yoshinom.SectionSortController = Ember.ArrayController.extend
  actions:
    toggleVenue: (venue) ->
      venue.toggleProperty 'showDetails'
      @forEach (otherVenue) ->
        if otherVenue isnt venue
          otherVenue.set 'showDetails', false

      true
