import computed from 'ember-computed';
import Mixin from 'ember-metal/mixin';

import YoshinomSectionModel from './model';

/**
 * Model decorations common to all Yoshinom sections.
 *
 * @public
 */
export default Mixin.create({

  model: computed(function() {
    return YoshinomSectionModel.create();
  }),

  /**
   * Shim query params into computed.sort's sortDefinition format.
   *
   * @private
   */
  _sorts2SortDefinition: computed('model.sorts.[]', function() {
    return this.get('model.sorts').map(function(sort) {
      return `${sort}:desc`;
    });
  }),

  arrangedContent: computed.sort('model.items.[]', '_sorts2SortDefinition'),

  tagCounts: computed.mapBy('model.tags', 'count'),
  tagsMaxCount: computed.max('tagCounts'),

  q: '', // query / filter / tags
  s: '', // sort

  queryParams: ['q', 's']

});
