import Ember from 'ember';

const { computed } = Ember;

import YoshinomItem from 'yoshinom/models/yoshinom-item';

export default YoshinomItem.extend({

  imageAlt: computed('name', function() {
    return `Photo of ${this.get('name')} cocktail`;
  })

});
