import identity from 'lodash/utility/identity';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test } from 'qunit';
import $ from 'jquery';

moduleForAcceptance('Acceptance | <meta> Description', {
  beforeEach() {
    const sheetTitles = ['Food', 'Cocktails'];
    sheetTitles.forEach(function(sheetTitle) {
      server.create('yoshinomItem', {
        sheet_id: sheetTitle, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
        fields: {
          Name: 'Earl\'s',
          Images: '/earls-gourmet-grub.jpg',
          Review: 'Da BOMB! Check out <a href="earls.com">their website</a>.'
        }
      });
    });
  }
});

function metaDescriptions() {
  return $('meta[property=description][content], meta[property^=og][content], meta[name^=twitter][content]');
}

const routes = ['food', 'cocktails'];
routes.forEach(function(route) {
  test(`${route} route adds description tags`, function(assert) {
    return visit(`/${route}`)
    .andThen(function() {
      const metas = metaDescriptions();
      const expectedNumMetas = 8;
      assert.equal(metas.length, expectedNumMetas, 'Expected # of meta descriptions');
      assert.equal(metas.toArray().filter(identity).length, expectedNumMetas, 'All meta contents non-empty');
    });
  });
});

test('Strips HTML', function(assert) {
  return visit('/food')
  .click('.card .preview')
  .andThen(function() {
    const texts = metaDescriptions()
    .filter('[property$=description], [name$=description]')
    .toArray()
    .map(function(text) {
      return $(text).attr('content');
    })
    .uniq();
    assert.deepEqual(texts, ['Yoshinom\'s review of Earl\'s. Da BOMB! Check out their website.']);
  });
});
