import Ember from 'ember';
import startApp from '../helpers/start-app';

import _ from 'lodash';

var application;

module('Acceptance: <meta> Description', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

const metaDescriptions = function() {
  return $('meta[property=description][content], meta[property^=og][content], meta[property^=twitter][content]');
};

['food', 'cocktails'].forEach(function(route) {
  test(`${route} route adds description tags`, function() {
    visit(`/${route}`);

    andThen(function() {
      const metas = metaDescriptions();
      const expectedNumMetas = 8;
      equal(metas.length, expectedNumMetas, 'Expected # of meta descriptions');
      equal(metas.toArray().filter(_.identity).length, expectedNumMetas, 'All meta contents non-empty');
    });
  });
});
