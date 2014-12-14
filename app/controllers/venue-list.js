import Ember from 'ember';

export default Ember.ArrayController.extend({

  directLinkToName: '',

  q: '', // query / filter / tags
  s: '', // sort

  queryParams: ['q', 's'],

  areImagesLoaded: function() {
    return this.every(function(item) { return item.get('isImageLoaded'); });
  }.property('content.@each.isImageLoaded'),

  actions: {

    toggleVenue: function(venue) {
      venue.toggleProperty('showDetails');
      return true;
    }

  }

});
