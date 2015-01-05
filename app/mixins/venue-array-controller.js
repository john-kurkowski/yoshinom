import Ember from 'ember';

export default Ember.Mixin.create({

  assertIsArrayController: function() {
    Ember.assert(this.constructor instanceof Ember.ArrayController, 'VenueArrayControllerMixin mixed into non-ArrayController ' + this.constructor);
  }.on('init'),

  tags: function() { return []; }.property(),

  indexRoute: '',

  directLinkToName: '',

  q: '', // query / filter / tags
  s: '', // sort

  queryParams: ['q', 's'],

  areImagesLoaded: function() {
    return this.get('content.length') && this.every(function(item) { return item.get('isImageLoaded'); });
  }.property('content.length', 'content.@each.isImageLoaded')

});
