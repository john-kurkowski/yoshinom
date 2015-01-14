import Ember from 'ember';
import _ from 'lodash';

/**
 * Card-like display of a YoshinomItem.
 */
export default Ember.Component.extend({

  item: null,
  itemRoute: "",

  _initialHiddenHeight: "",

  assertItem: function() {
    Ember.assert('No item passed to yoshinom-card', this.get('item'));
  }.on('init'),

  classNameBindings: [
    ':card',
    'item.isImageLoaded:loaded',
    'item.review:reviewed',
    'item.showDetails:selected'
  ],

  formattedReview: function() {
    return `<p>${this.get('item.review').replace(/\n/g, '</p><p>')}</p>`.htmlSafe();
  }.property('item.review'),

  showRatings: function() {
    if (!this.get('item.isImageLoaded')) {
      return false;
    }

    const hasSomeRating = _.values(this.get('item.ratings'))
    .some(function identity(value) { return value; });
    return hasSomeRating;
  }.property('item.isImageLoaded', 'item.ratings'),

  didInsertElement: function() {
    const self = this;

    this._super();

    this.$('img').one('load error', function setImageLoaded() {
      self.set('item.isImageLoaded', true);
    })
    .each(function handleCachedImages() {
      if (this.complete) {
        Ember.$(this).load();
      }
    });
  },

  willDestroyElement: function() {
    this._super();
    this.$('img').off('load error');
  },

  visuallyToggleDetails: function() {
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
  }.observes('item.showDetails').on('didInsertElement'),

  actions: {

    toggleItem: function() {
      const item = this.get('item');
      item.toggleProperty('showDetails');
      this.sendAction('action', item);
    }

  }

});
