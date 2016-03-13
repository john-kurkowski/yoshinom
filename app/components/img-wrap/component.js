import Ember from 'ember';

const { $, computed, K, on, run } = Ember;

export default Ember.Component.extend({

  /*
    @public
  */
  alt: null,

  /*
    @public
  */
  src: null,

  /*
    @public
  */
  onLoad: computed(function() {
    return K;
  }),

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

  setupImageEventsOnDidInsertElement: on('didInsertElement', function() {
    run.scheduleOnce('afterRender', this, this.setupImageEvents);
  }),

  setupImageEvents() {
    this.$()
      .one('load', run.bind(this, this.setProperties, { isLoaded: true }))
      .one('error', run.bind(this, this.setProperties, { isLoaded: true, isError: true }))
      .one('load error', run.bind(this, function() {
        this.get('onLoad')(this);
      }))
      .each(function handleCachedImages() {
        if (this.complete) {
          $(this).load();
        }
      });
  },

  teardownImageEvents: on('willDestroyElement', function() {
    this.$().off('load error');
  })

});
