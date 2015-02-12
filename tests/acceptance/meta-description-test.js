import Ember from 'ember';
import startApp from '../helpers/start-app';
import { test } from 'ember-qunit';
import _ from 'lodash';

import FoodItem from 'yoshinom/models/food-item';

const spreadsheetRowsStub = [
  FoodItem.create({
    name: 'Earl\'s',
    images: ['/earls-gourmet-grub.jpg'],
    review: 'Da BOMB! Check out <a href="earls.com">their website</a>.',
  })
];

let application;
let sandbox;

module('Acceptance: <meta> Description', {
  setup: function() {
    application = startApp();

    sandbox = sinon.sandbox.create();
    const spreadsheetService = application.__container__.lookup('service:spreadsheet');
    sinon.stub(spreadsheetService, 'find', function() {
      return new Ember.RSVP.resolve(spreadsheetRowsStub);
    });
  },
  teardown: function() {
    sandbox.restore();

    Ember.run(application, 'destroy');
  }
});

const metaDescriptions = function() {
  return $('meta[property=description][content], meta[property^=og][content], meta[name^=twitter][content]');
};

['food', 'cocktails'].forEach(function(route) {
  test(`${route} route adds description tags`, function() {
    return visit(`/${route}`)
    .andThen(function() {
      const metas = metaDescriptions();
      const expectedNumMetas = 8;
      equal(metas.length, expectedNumMetas, 'Expected # of meta descriptions');
      equal(metas.toArray().filter(_.identity).length, expectedNumMetas, 'All meta contents non-empty');
    });
  });
});

test('Strips HTML', function() {
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
    deepEqual(texts, ['Yoshinom\'s review of Earl\'s. Da BOMB! Check out their website.']);
  });
});
