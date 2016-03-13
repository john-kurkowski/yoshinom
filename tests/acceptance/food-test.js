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
