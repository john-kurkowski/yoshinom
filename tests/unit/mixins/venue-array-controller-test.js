import Ember from 'ember';
import VenueArrayControllerMixin from 'yoshinom/mixins/venue-array-controller';

module('VenueArrayControllerMixin');

// Replace this with your real tests.
test('it works', function() {
  var VenueListControllerObject = Ember.Object.extend(VenueArrayControllerMixin);
  var subject = VenueListControllerObject.create();
  ok(subject);
});
