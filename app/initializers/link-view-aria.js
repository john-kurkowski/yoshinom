import Ember from 'ember';

/**
 * Reopen LinkComponent instances to improve current-state accessibility via the
 * aria-selected attribute. There is some debate around this, but it does the
 * trick.
 */
export function initialize(/* container, application */) {
  Ember.LinkComponent.reopen({

    attributeBindings: ['ariaSelected:aria-selected'],

    ariaSelected: function() {
      return this.get('active') ? 'true' : 'false';
    }.property('active'),

  });
}

export default {
  name: 'link-view-aria',
  initialize: initialize
};
