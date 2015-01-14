import Ember from 'ember';

/**
 * Reopen LinkView instances to
 *
 * * Allow an action. Specify any params with the `actionParam` attribute.
 * * Improve current-state accessibility via the aria-selected attribute. There
 *   is some debate around this, but it does the trick.
 *
 * From http://stackoverflow.com/a/20383651/62269
 */
export function initialize(/* container, application */) {
  Ember.LinkView.reopen({

    attributeBindings: ['ariaSelected:aria-selected'],

    action: null,

    ariaSelected: function() {
      return this.get('active') ? 'true' : 'false';
    }.property('active'),

    _invoke: function(event) {
      const action = this.get('action');
      if (action) {
        // There was an action specified (in handlebars) so take custom action
        event.preventDefault(); // prevent the browser from following the link as normal
        if (this.bubbles === false) {
          event.stopPropagation();
        }

        // trigger the action whatever surrounds the LinkView
        this.get('parentView').send(action, this.get('actionParam'));
        return false;
      } else {
        // no action to take, handle the link-to normally
        return this._super(event);
      }
    }

  });
}

export default {
  name: 'link-view',
  initialize: initialize
};
