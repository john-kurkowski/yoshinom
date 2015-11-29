import Ember from 'ember';

export default Ember.Controller.extend({

  isDrinking: Ember.computed('currentPath', function() {
    return /cocktails/.test(this.get('currentPath'));
  })

});
