import Ember from 'ember';

/**
 * Abstract base route for a single item on the site, such as a particular
 * restaurant, usually within a greater list of such items.
 *
 * Enough is inferred from extending routes' path name that they shouldn't have
 * to override any property.
 *
 * @protected
 */
export default Ember.Route.extend({

  parentRoute: Ember.computed('routeName', function() {
    const [, allButLastDot] = /(.*)\./.exec(this.get('routeName'));
    return allButLastDot;
  }),

  model(params) {
    const name = decodeURIComponent(params.name);
    const parentModel = this.modelFor(this.get('parentRoute'));
    const model = parentModel.items.findBy('name', name);
    if (model) {
      this.controllerFor(this.get('parentRoute')).set('directLinkToName', name);
      return model;
    } else {
      throw new Error(`${this.constructor.toString()} not found: ${name}`);
    }
  },

  titleToken(model) {
    return model.get('name');
  },

  setupController(controller, model) {
    model.set('showDetails', true);
    this._super.apply(this, arguments);

    const description = `Yoshinom's review of ${model.get('name')}. ${s.stripTags(model.get('review'))}`;
    this.send('updateMetaDescription', description, model.get('images'));
  },

  teardownMetaDescription: Ember.on('deactivate', function() {
    this.send('updateMetaDescription');
  }),

  actions: {

    toggleItem(item) {
      const hideItem = !item.get('showDetails');
      if (hideItem) {
        this.transitionTo(this.get('parentRoute'));
      }
      return true;
    },

    willTransition(/*transition*/) {
      const model = this.modelFor(this.routeName);
      model.set('showDetails', false);
    }

  }

});
