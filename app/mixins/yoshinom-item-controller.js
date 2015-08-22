import Ember from 'ember';

export default Ember.Mixin.create({

  tags: function() { return []; }.property(),

  tagCounts: Ember.computed.mapBy('tags', 'count'),
  tagsMaxCount: Ember.computed.max('tagCounts'),

  indexRoute: '',

  directLinkToName: '',

  q: '', // query / filter / tags
  s: '', // sort

  queryParams: ['q', 's'],

  areImagesLoaded: function() {
    return this.get('model').everyBy('isImageLoaded');
  }.property('model.@each.isImageLoaded')

});
