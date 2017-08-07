import { test } from 'qunit';

import moduleForAcceptance from 'yoshinom/tests/helpers/module-for-acceptance';
import waitUntil from 'yoshinom/tests/helpers/wait-until';

import { defaultTestScenario } from 'yoshinom/mirage/scenarios/default';

moduleForAcceptance('Acceptance | food', {
  beforeEach() {
    defaultTestScenario(server);

    this.scrollTop = () => this.application.$('#ember-testing-container').scrollTop();
  },
});

test('visiting /food', function(assert) {
  visit('/food');

  andThen(() => {
    assert.equal(currentURL(), '/food');
  });

  andThen(waitUntilSectionLoaded);

  andThen(() => {
    assert.ok(this.scrollTop() < 100, 'App loads close to top');
  });
});

test('failed images', function(assert) {
  visit('/food');

  andThen(waitUntilSectionLoaded);

  andThen(() => {
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
      false,
    ], 'Not found images');
  });
});

test('direct link', function(assert) {
  const belowTheFoldItemName = 'Dibbert Group';
  visit(`/food/${belowTheFoldItemName}`);

  andThen(waitUntilSectionLoaded);

  andThen(() => {
    const linkedCard = find(`.card .name:contains(${belowTheFoldItemName})`).closest('.card');
    assert.equal(linkedCard.length, 1, 'Found linked card on page');
    assert.ok(linkedCard.is('.selected'), 'Linked card is selected');

    const cardIndex = find('.card').index(linkedCard);
    assert.ok(cardIndex > 2, `Card is below the fold (card #${cardIndex})`);

    assert.ok(this.scrollTop() > 100, 'App auto scrolled to card');
  });
});

function waitUntilSectionLoaded() {
  const matchingYoshinomItems = server.db.yoshinomItems
    .where({ sheet_id: 'Food' }); // eslint-disable-line camelcase

  waitUntil(function isSectionLoaded() {
    return find('.card.loaded').length === matchingYoshinomItems.length;
  });
}
