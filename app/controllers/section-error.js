import Ember from 'ember';

const { computed, Controller } = Ember;

export default Controller.extend({

  isNotFound: computed('model.message', function() {
    const message = this.get('model.message');
    return message && message.toLowerCase().indexOf('not found') >= 0;
  })

});
