import Ember from 'ember';
import _ from 'lodash';

/**
 * Card-like display of a YoshinomItem.
 *
 * @public
 */
export default Ember.Component.extend({

  item: null,
  itemRoute: '',

  _initialHiddenHeight: '',

  assertItem: Ember.on('init', function() {
    Ember.assert('No item passed to yoshinom-card', this.get('item'));
  }),

  classNameBindings: [
    ':card',
    'item.isImageLoaded:loaded',
    'item.review:reviewed',
    'item.showDetails:selected'
  ],

  formattedReview: Ember.computed('item.review', function() {
    return `<p>${this.get('item.review').replace(/\n/g, '</p><p>')}</p>`.htmlSafe();
  }),

  showRatings: Ember.computed('item.isImageLoaded', 'item.ratings', function() {
    if (!this.get('item.isImageLoaded')) {
      return false;
    }

    const hasSomeRating = _.values(this.get('item.ratings'))
    .some(_.identity);
    return hasSomeRating;
  }),

  setupImageEvents: Ember.on('didInsertElement', function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$('img')
      .one('load error', Ember.run.bind(this, this.set, 'item.isImageLoaded', true))
      .each(function handleCachedImages() {
        if (this.complete) {
          Ember.$(this).load();
        }
      });
    });
  }),

  teardownImageEvents: Ember.on('willDestroyElement', function() {
    this.$('img').off('load error');
  }),

  visuallyToggleDetailsOnDidInsertElement: Ember.on('didInsertElement', function() {
    Ember.run.scheduleOnce('afterRender', this, this.visuallyToggleDetails);
  }),

  visuallyToggleDetails: Ember.observer('item.showDetails', function() {
    const expandTarget = this.$('.details');

    if (!this.get('_initialHiddenHeight')) {
      this.set('_initialHiddenHeight', expandTarget.height());
    }

    let newHeight;
    if (this.get('item.showDetails')) {
      newHeight = Array.prototype.reduce.call(expandTarget[0].childNodes, function(p, c) {
        return p + (c.offsetHeight || 0);
      }, 0);
    } else {
      newHeight = this.get('_initialHiddenHeight');
    }
    expandTarget.height(newHeight);
  }),

  actions: {

    toggleItem() {
      const item = this.get('item');
      item.toggleProperty('showDetails');
      this.sendAction('action', item);
    }

  }

});
