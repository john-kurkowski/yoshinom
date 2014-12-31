import Ember from 'ember';

import VenueArrayControllerMixin from 'yoshinom/mixins/venue-array-controller';

export default Ember.ArrayController.extend(VenueArrayControllerMixin, {

  q: 'West LA',
  s: 'ratings.food'

});
