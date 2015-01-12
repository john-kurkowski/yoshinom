import Ember from 'ember';

export default Ember.Route.extend({

  title: function(tokens) {
    tokens.reverse();
    tokens.push('Yoshinom');
    return tokens.join(' | ');
  }

});
