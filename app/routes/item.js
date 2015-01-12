import Ember from 'ember';

/**
 * Base route for a single item on the site, such as a particular restaurant,
 * usually within a greater list of such items.
 */
export default Ember.Route.extend({

  parentRoute: function() {
    var allButLastDot = /(.*)\./.exec(this.get('routeName'));
    return allButLastDot[1];
  }.property('routeName'),

  model: function(params) {
    var name = decodeURIComponent(params.name);
    var parentModel = this.modelFor(this.get('parentRoute'));
    var model = parentModel.items.findBy('name', name);
    if (model) {
      this.controllerFor(this.get('parentRoute')).set('directLinkToName', name);
      return model;
    } else {
      return this.transitionTo('fourOhFour'); // TODO
    }
  },

  setupController: function(controller, model) {
    model.set('showDetails', true);
    this._super.apply(this, arguments);
  },

  actions: {

    toggleItem: function(item) {
      var hideItem = !item.get('showDetails');
      if (hideItem) {
        this.transitionTo(this.get('parentRoute'));
      } else {
        return true;
      }
    },

    willTransition: function(/*transition*/) {
      var model = this.modelFor(this.routeName);
      model.set('showDetails', false);
    }

  }

});
