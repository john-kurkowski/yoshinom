import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function() {
    this.replaceWith('food', { queryParams: { filter: 'westla' } });
  }

});
