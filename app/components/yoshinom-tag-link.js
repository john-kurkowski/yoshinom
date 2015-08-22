import Ember from 'ember';

export default Ember.Component.extend({

  tagObject: null,
  indexRoute: '',
  maxCount: 0,

  tagName: '',
  isVirtual: true,

  countTitle: Ember.computed('tagObject.count', function() {
    return `${this.get('tagObject.count')} hits`;
  }),

  countStyle: Ember.computed('tagObject.count', 'maxCount', function() {
    const percent = this.get('tagObject.count') / this.get('maxCount') * 100;
    return `height: ${percent}%;`;
  })

});
