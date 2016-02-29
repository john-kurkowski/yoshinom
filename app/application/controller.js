import Ember from 'ember';

const { computed, Controller } = Ember;

export default Controller.extend({

  isDrinking: computed('currentPath', function() {
    return /cocktails/.test(this.get('currentPath'));
  })

});
