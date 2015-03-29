import Ember from 'ember';

export default Ember.Component.extend({

  tagObject: null,
  indexRoute: '',
  maxCount: 0,

  tagName: '',
  isVirtual: true,

  countTitle: function() {
    return `${this.get('tagObject.count')} hits`;
  }.property('tagObject.count'),

  countStyle: function() {
    const percent = this.get('tagObject.count') / this.get('maxCount') * 100;
    return `height: ${percent}%;`;
  }.property('tagObject.count', 'maxCount')

});
