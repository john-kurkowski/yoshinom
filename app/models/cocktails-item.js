import computed from 'ember-computed';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

export default YoshinomItem.extend({

  imageAlt: computed('name', function() {
    return `Photo of ${this.get('name')} cocktail`;
  })

});
