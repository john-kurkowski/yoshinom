import YoshinomItem from 'yoshinom/models/yoshinom-item';

export default YoshinomItem.extend({

  imageAlt: function() {
    return 'Photo of food & drink at ' + this.get('name');
  }.property('name')

});
