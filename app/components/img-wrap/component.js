import Ember from 'ember';

const { $, on, run } = Ember;

export default Ember.Component.extend({

  /*
    @public
  */
  alt: null,

  /*
    @public
  */
  src: null,

  tagName: 'img',
  attributeBindings: [
    'alt',
    'src'
  ],
  classNameBindings: [
    'isError',
    'isLoaded'
  ],

  isError: false,

  isLoaded: false,

  setupImageEvents: on('didInsertElement', function() {
    this.$()
      .one('load', run.bind(this, this.setProperties, { isLoaded: true }))
      .one('error', run.bind(this, this.setProperties, { isLoaded: true, isError: true }))
      .each(function handleCachedImages() {
        if (this.complete) {
          $(this).load();
        }
      });
  }),

  teardownImageEvents: on('willDestroyElement', function() {
    this.$().off('load error');
  })

});
