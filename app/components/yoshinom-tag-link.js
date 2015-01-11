import Ember from 'ember';

export default Ember.Component.extend({

  tag: null,
  indexRoute: '',
  maxCount: 0,

  tagName: '',
  isVirtual: true,

  countTitle: function() {
    return this.get('tag.count') + ' hits';
  }.property('tag.count'),

  countStyle: function() {
    var percent = this.get('tag.count') / this.get('maxCount') * 100;
    return "height: " + percent + "%;";
  }.property('tag.count', 'maxCount')

});
