import Ember from 'ember';

/**
 * Reopen LinkView instances to allow an action. Specify any params with the
 * `actionParam` attribute.
 *
 * From http://stackoverflow.com/a/20383651/62269
 */
export function initialize(/* container, application */) {
  Ember.LinkView.reopen({

    action: null,

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
  name: 'link-view-action',
  initialize: initialize
};
