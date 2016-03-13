import { test } from 'qunit';
import moduleForAcceptance from 'yoshinom/tests/helpers/module-for-acceptance';

import { defaultTestScenario } from 'yoshinom/mirage/scenarios/default';

moduleForAcceptance('Acceptance | food', {
  beforeEach() {
    defaultTestScenario(server);

    visit('/food');
  }
});

test('visiting /food', function(assert) {
  assert.equal(currentURL(), '/food');

  const cards = find('.card');
  assert.equal(cards.length, 10, 'Total cards');

  const loadedCards = cards.filter('.loaded');
  assert.equal(loadedCards.length, 10, 'All cards load');
});

test('failed images', function(assert) {
  const images = find('.card .preview img')
    .toArray()
    .map(this.application.$);

  assert.equal(images.length, 10, 'Total image count');

  const missingImageOverrides = images
    .map((el) => el.is('.is-error'));

  assert.deepEqual(missingImageOverrides, [
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false
  ], 'Not found images');
});
