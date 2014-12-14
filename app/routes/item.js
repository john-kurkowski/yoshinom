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
    var model = this.modelFor(this.get('parentRoute')).items.findBy('name', name);
    if (model) {
      model.set('isDirectLink', true);
      return model;
    } else {
      return this.transitionTo('fourOhFour'); // TODO
    }
  },

  actions: {

    toggleVenue: function(venue) {
      var hideVenue = !venue.get('showDetails');
      if (hideVenue) {
        this.transitionTo(this.get('parentRoute'));
      }
      return true;
    }

  }

});
