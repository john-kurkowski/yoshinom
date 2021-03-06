import EmberObject from 'ember-object';
import {
  moduleForComponent,
  test,
} from 'ember-qunit';

moduleForComponent('yoshinom-card', 'YoshinomCardComponent', {
  // specify the other units that are required for this test
  needs: [
    'component:img-wrap',
    'component:yoshinom-loader',
  ],
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  const component = this.subject({
    item: EmberObject.create({
      ratings: {},
    }),
  });
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
