import Ember from 'ember';

/**
 * Base route for a single item on the site, such as a particular restaurant,
 * usually within a greater list of such items.
 */
export default Ember.Route.extend({

  parentRoute: function() {
    const [, allButLastDot] = /(.*)\./.exec(this.get('routeName'));
    return allButLastDot;
  }.property('routeName'),

  model: function(params) {
    const name = decodeURIComponent(params.name);
    const parentModel = this.modelFor(this.get('parentRoute'));
    const model = parentModel.items.findBy('name', name);
    if (model) {
      this.controllerFor(this.get('parentRoute')).set('directLinkToName', name);
      return model;
    } else {
      return this.transitionTo('fourOhFour'); // TODO
    }
  },

  titleToken: function(model) {
    return model.get('name');
  },

  setupController: function(controller, model) {
    model.set('showDetails', true);
    this._super.apply(this, arguments);

    const description = model.get('review');
    this.send('updateMetaDescription', description, model.get('images'));
  },

  teardownMetaDescription: function() {
    this.send('updateMetaDescription');
  }.on('deactivate'),

  actions: {

    toggleItem: function(item) {
      const hideItem = !item.get('showDetails');
      if (hideItem) {
        this.transitionTo(this.get('parentRoute'));
      }
      return true;
    },

    willTransition: function(/*transition*/) {
      const model = this.modelFor(this.routeName);
      model.set('showDetails', false);
    }

  }

});
