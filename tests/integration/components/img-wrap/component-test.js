import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import waitUntil from '../../../helpers/components/wait-until';

moduleForComponent('img-wrap', 'Integration | Component | img wrap', {
  integration: true,

  beforeEach() {
    this.isLoaded = () => this.$('img').is('.is-loaded');
  }
});

test('it has the expected HTML', function(assert) {
  this.render(hbs`{{img-wrap}}`);
  assert.deepEqual(this.$().children().toArray().mapBy('tagName'), ['IMG'], 'HTML tags');
});

test('it has the expected success class names', function(assert) {
  this.render(hbs`{{img-wrap src="/logo.png"}}`);

  return waitUntil(this.isLoaded)
    .then(() => {
      assert.ok(!this.$('img').is('.is-error'));
    });
});

test('it has the expected error class names', function(assert) {
  this.render(hbs`{{img-wrap src="/non-existent.png"}}`);

  return waitUntil(this.isLoaded)
    .then(() => {
      assert.ok(this.$('img').is('.is-error'));
    });
});
