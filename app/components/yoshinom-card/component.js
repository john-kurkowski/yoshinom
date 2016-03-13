import Ember from 'ember';
import identity from 'lodash/utility/identity';
import values from 'lodash/object/values';

const { assert, Component, computed, observer, on, run } = Ember;

/**
 * Card-like display of a YoshinomItem.
 *
 * @public
 */
export default Component.extend({

  item: null,
  itemRoute: '',

  _initialHiddenHeight: '',

  assertItem: on('init', function() {
    assert('No item passed to yoshinom-card', this.get('item'));
  }),

  classNameBindings: [
    ':card',
    'item.isImageLoaded:loaded',
    'item.review:reviewed',
    'item.showDetails:selected'
  ],

  formattedReview: computed('item.review', function() {
    return `<p>${this.get('item.review').replace(/\n/g, '</p><p>')}</p>`.htmlSafe();
  }),

  showRatings: computed('item.isImageLoaded', 'item.ratings', function() {
    if (!this.get('item.isImageLoaded')) {
      return false;
    }

    const hasSomeRating = values(this.get('item.ratings'))
    .some(identity);
    return hasSomeRating;
  }),

  visuallyToggleDetailsOnDidInsertElement: on('didInsertElement', function() {
    run.scheduleOnce('afterRender', this, this.visuallyToggleDetails);
  }),

  visuallyToggleDetails: observer('item.showDetails', function() {
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

    onImageLoad() {
      this.set('item.isImageLoaded', true);
    },

    toggleItem() {
      const item = this.get('item');
      item.toggleProperty('showDetails');
      this.sendAction('action', item);
    }

  }

});
