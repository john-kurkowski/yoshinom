import Ember from 'ember';
import SectionRouteMixin from 'yoshinom/mixins/section-route';

module('SectionRouteMixin');

// Replace this with your real tests.
test('it works', function() {
  var SectionRouteObject = Ember.Object.extend(SectionRouteMixin);
  var subject = SectionRouteObject.create();
  ok(subject);
});
