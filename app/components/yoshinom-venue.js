import Ember from 'ember';

export default Ember.Component.extend({

  venue: null,
  itemRoute: "",

  _initialHiddenHeight: "",

  assertVenue: function() {
    Ember.assert(this.get('venue'), 'No venue passed to yoshinom-venue');
  }.on('init'),

  classNameBindings: [
    ':venue',
    'venue.isImageLoaded:loaded',
    'venue.review:reviewed',
    'venue.showDetails:selected'
  ],

  formattedReview: function() {
    return ("<p>" + this.get('venue.review').replace(/\n/g, '</p><p>') + "</p>").htmlSafe();
  }.property('venue.review'),

  showRatings: function() {
    var obj;
    var values;
    var hasSomeRating;

    if (!this.get('venue.isImageLoaded')) {
      return false;
    }

    obj = this.get('venue.ratings');
    values = Object.keys(obj).map(function(key) { return obj[key]; });
    hasSomeRating = values.some(function(value) { return value; });
    return hasSomeRating;
  }.property('venue.isImageLoaded', 'venue.ratings'),

  didInsertElement: function() {
    var self = this;

    this._super();

    this.$('img').one('load error', function setImageLoaded() {
      self.set('venue.isImageLoaded', true);
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

    if (this.get('venue.showDetails')) {
      newHeight = Array.prototype.reduce.call(expandTarget[0].childNodes, function(p, c) {
        return p + (c.offsetHeight || 0);
      }, 0);
    } else {
      newHeight = this.get('_initialHiddenHeight');
    }
    expandTarget.height(newHeight);
  }.observes('venue.showDetails').on('didInsertElement'),

  actions: {

    toggleVenue: function() {
      var venue = this.get('venue');
      venue.toggleProperty('showDetails');
      this.sendAction('action', venue);
    }

  }

});
