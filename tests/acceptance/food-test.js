import { test } from 'qunit';
import moduleForAcceptance from 'yoshinom/tests/helpers/module-for-acceptance';
import waitUntil from 'yoshinom/tests/helpers/wait-until';

import { defaultTestScenario } from 'yoshinom/mirage/scenarios/default';

moduleForAcceptance('Acceptance | food', {
  beforeEach() {
    defaultTestScenario(server);

    const matchingYoshinomItems = server.db.yoshinomItems
      .where({ sheet_id: 'Food' }); // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers

    visit('/food');

    waitUntil(function isSectionLoaded() {
      return find('.card.loaded').length === matchingYoshinomItems.length;
    });
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
