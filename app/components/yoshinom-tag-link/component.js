import Component from 'ember-component';
import computed from 'ember-computed';

export default Component.extend({

  tagObject: null,
  indexRoute: '',
  maxCount: 0,

  tagName: '',
  isVirtual: true,

  countTitle: computed('tagObject.count', function() {
    return `${this.get('tagObject.count')} hits`;
  }),

  countStyle: computed('tagObject.count', 'maxCount', function() {
    const percent = this.get('tagObject.count') / this.get('maxCount') * 100;
    return `height: ${percent}%;`;
  })

});
