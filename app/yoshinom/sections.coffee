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
    showVenue: (venue) ->
      @forEach (otherVenue) ->
        otherVenue.set 'showDetails', false
      venue.set 'showDetails', true
