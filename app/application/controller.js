import computed from 'ember-computed';
import Controller from 'ember-controller';

export default Controller.extend({

  isDrinking: computed('currentPath', function() {
    return /cocktails/.test(this.get('currentPath'));
  }),

});
