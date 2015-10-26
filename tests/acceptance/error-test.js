import Ember from 'ember';
import QUnit from 'qunit';
import { module/*, test*/ } from 'qunit';
import startApp from 'yoshinom/tests/helpers/start-app';

import { createSheets} from 'yoshinom/mirage/scenarios/default';

module('Acceptance | error', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    Ember.run(this.application, 'destroy');
  }
});

// TODO: Ember fails any test that triggers the default error handler. How to
//       work around?

QUnit.skip('section page error', function(/*assert*/) {
});

QUnit.skip('detail page 404', function(assert) {
  createSheets(server);

  const unlikelyDetailRoute = '/food/unlikely-restaurant-name';
  visit(unlikelyDetailRoute);

  andThen(function() {
    assert.equal(currentURL(), unlikelyDetailRoute);
  });
});
