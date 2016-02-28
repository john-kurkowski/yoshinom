import Ember from 'ember';
import forEach from 'lodash/collection/forEach';
import identity from 'lodash/utility/identity';
import startApp from '../helpers/start-app';
import { test, module } from 'qunit';

const { run } = Ember;

import { createSheets} from 'yoshinom/mirage/scenarios/default';

let application;

module('Acceptance | <meta> Description', {
  beforeEach() {
    application = startApp();

    const sheets = createSheets(server);

    forEach(sheets, function(sheet) {
      server.create('yoshinomItem', {
        sheet_id: sheet.id, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
        gsx$name: {
          $t: 'Earl\'s'
        },
        gsx$images: {
          $t: '/earls-gourmet-grub.jpg'
        },
        gsx$review: {
          $t: 'Da BOMB! Check out <a href="earls.com">their website</a>.'
        }
      });
    });
  },

  afterEach() {
    run(application, 'destroy');
  }
});

const metaDescriptions = function() {
  return $('meta[property=description][content], meta[property^=og][content], meta[name^=twitter][content]');
};

['food', 'cocktails'].forEach(function(route) {
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
