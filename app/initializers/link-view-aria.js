import Ember from 'ember';

const { computed, LinkComponent } = Ember;

/**
 * Reopen LinkComponent instances to improve current-state accessibility via the
 * aria-selected attribute. There is some debate around this, but it does the
 * trick.
 *
 * @private
 */
export function initialize(/* container, application */) {
  LinkComponent.reopen({

    attributeBindings: ['ariaSelected:aria-selected'],

    ariaSelected: computed('active', function() {
      return this.get('active') ? 'true' : 'false';
    })

  });
}

export default {
  name: 'link-view-aria',
  initialize
};
