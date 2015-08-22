import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel() {
    this.replaceWith('food', { queryParams: { q: 'West LA' } });
  }

});
