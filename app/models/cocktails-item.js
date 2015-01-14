import YoshinomItem from 'yoshinom/models/yoshinom-item';

export default YoshinomItem.extend({

  imageAlt: function() {
    return `Photo of ${this.get('name')} cocktail`;
  }.property('name')

});
