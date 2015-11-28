import Ember from 'ember';

import YoshinomSectionModel from 'yoshinom/models/yoshinom-section-model';

export default Ember.Mixin.create({

  model: Ember.computed(function() {
    return YoshinomSectionModel.create();
  }),

  /**
   * Shim query params into Ember.computed.sort's sortDefinition format.
   *
   * @private
   */
  _sorts2SortDefinition: Ember.computed('model.sorts.[]', function() {
    return this.get('model.sorts').map(function(sort) {
      return `${sort}:desc`;
    });
  }),

  arrangedContent: Ember.computed.sort('model.items.[]', '_sorts2SortDefinition'),

  tagCounts: Ember.computed.mapBy('model.tags', 'count'),
  tagsMaxCount: Ember.computed.max('tagCounts'),

  indexRoute: '',

  directLinkToName: '',

  q: '', // query / filter / tags
  s: '', // sort

  queryParams: ['q', 's']

});
