import Ember from 'ember';

export default Ember.Mixin.create({

  assertIsArrayController: function() {
    Ember.assert(`YoshinomItemArrayControllerMixin mixed into non-ArrayController ${this.constructor}`, this.constructor instanceof Ember.ArrayController.constructor);
  }.on('init'),

  tags: function() { return []; }.property(),

  tagCounts: Ember.computed.mapBy('tags', 'count'),
  tagsMaxCount: Ember.computed.max('tagCounts'),

  indexRoute: '',

  directLinkToName: '',

  q: '', // query / filter / tags
  s: '', // sort

  queryParams: ['q', 's'],

  areImagesLoaded: function() {
    return this.everyBy('isImageLoaded');
  }.property('content.@each.isImageLoaded')

});
