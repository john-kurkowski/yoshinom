import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('yoshinom-venue', 'YoshinomVenueComponent', {
  // specify the other units that are required for this test
  needs: ['component:yoshinom-loading']
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    venue: Ember.Object.create({
      ratings: {}
    })
  });
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});
