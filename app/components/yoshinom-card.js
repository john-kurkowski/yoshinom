import Ember from 'ember';

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

  imageAlt: function() {
    return 'Photo of food & drink at ' + this.get('item.name');
  }.property('item.name'),

  formattedReview: function() {
    return ("<p>" + this.get('item.review').replace(/\n/g, '</p><p>') + "</p>").htmlSafe();
  }.property('item.review'),

  showRatings: function() {
    var obj;
    var values;
    var hasSomeRating;

    if (!this.get('item.isImageLoaded')) {
      return false;
    }

    obj = this.get('item.ratings');
    values = Object.keys(obj).map(function(key) { return obj[key]; });
    hasSomeRating = values.some(function(value) { return value; });
    return hasSomeRating;
  }.property('item.isImageLoaded', 'item.ratings'),

  didInsertElement: function() {
    var self = this;

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
    var expandTarget = this.$('.details');
    var newHeight;

    if (!this.get('_initialHiddenHeight')) {
      this.set('_initialHiddenHeight', expandTarget.height());
    }

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
      var item = this.get('item');
      item.toggleProperty('showDetails');
      this.sendAction('action', item);
    }

  }

});