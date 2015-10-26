import Ember from 'ember';

export default Ember.Controller.extend({

  isNotFound: Ember.computed('model.message', function() {
    const message = this.get('model.message');
    return message && message.toLowerCase().indexOf('not found') >= 0;
  })

});
