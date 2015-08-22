import Ember from 'ember';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

export default YoshinomItem.extend({

  imageAlt: Ember.computed('name', function() {
    return `Photo of ${this.get('name')} cocktail`;
  })

});
