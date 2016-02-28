import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({

  beforeModel() {
    this.replaceWith('food', { queryParams: { q: 'West LA' } });
  }

});
