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
      equal(metas.length, 7, 'Expected # of meta descriptions');
      equal(metas.toArray().filter(_.identity).length, 7, 'All meta contents non-empty');
    });
  });
});
