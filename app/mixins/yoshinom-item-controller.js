import Ember from 'ember';

export default Ember.Mixin.create({

  tags: Ember.computed(function() {
    return [];
  }),

  tagCounts: Ember.computed.mapBy('tags', 'count'),
  tagsMaxCount: Ember.computed.max('tagCounts'),

  indexRoute: '',

  directLinkToName: '',

  q: '', // query / filter / tags
  s: '', // sort

  queryParams: ['q', 's'],

  areImagesLoaded: Ember.computed('model.@each.isImageLoaded', function() {
    return this.get('model').everyBy('isImageLoaded');
  })

});
