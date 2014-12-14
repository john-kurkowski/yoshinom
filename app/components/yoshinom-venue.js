import Ember from 'ember';

export default Ember.Component.extend({

  venue: null,
  itemRoute: "",

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
  }.property('venue.isImageLoaded', 'venue.ratings')

});
