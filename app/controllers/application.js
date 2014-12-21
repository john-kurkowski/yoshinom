import Ember from 'ember';

export default Ember.Controller.extend({

  isDrinking: function() {
    return /cocktails/.test(this.get('currentPath'));
  }.property('currentPath')

});
