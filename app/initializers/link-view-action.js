import Ember from 'ember';

const { LinkComponent } = Ember;

/**
 * Reopen LinkComponent instances to allow an action. Specify any params with the
 * `actionParam` attribute.
 *
 * From http://stackoverflow.com/a/20383651/62269
 *
 * @private
 */
export function initialize(/* container, application */) {
  LinkComponent.reopen({

    action: null,

    _invoke(event) {
      const action = this.get('action');
      if (action) {
        // There was an action specified (in handlebars) so take custom action
        event.preventDefault(); // prevent the browser from following the link as normal
        if (this.bubbles === false) {
          event.stopPropagation();
        }

        // trigger the action whatever surrounds the LinkComponent
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
  initialize
};
