import Ember from 'ember';

export default Ember.ArrayController.extend({

  filter: '',
  sort: '',

  queryParams: ['filter', 'sort'],

  areImagesLoaded: function() {
    return this.every(function(item) { return item.get('isImageLoaded'); });
  }.property('content.@each.isImageLoaded'),

  actions: {

    toggleVenue: function(venue) {
      venue.toggleProperty('showDetails');
      this.rejectBy('name', venue.get('name')).setEach('showDetails', false);
      return true;
    }

  }

});
