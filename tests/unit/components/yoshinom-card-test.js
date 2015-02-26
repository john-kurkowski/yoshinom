import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('yoshinom-card', 'YoshinomCardComponent', {
  // specify the other units that are required for this test
  needs: ['component:yoshinom-loading']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({
    item: Ember.Object.create({
      ratings: {}
    })
  });
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
