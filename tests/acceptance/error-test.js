import Ember from 'ember';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import sinon from 'sinon';
import { test } from 'qunit';

const { Test } = Ember;

import defaultScenario from 'yoshinom/mirage/scenarios/default';

moduleForAcceptance('Acceptance | error', {
  beforeEach() {
    this.sandbox = sinon.sandbox.create();

    // Override Ember.Test's default failure on uncaught errors. See http://stackoverflow.com/a/34138273/62269
    this.sandbox.stub(Test.adapter, 'exception');
  },

  afterEach() {
    this.sandbox.restore();
  }
});

test('section page error', function(assert) {
  assert.expect(3);

  // Don't create any data, to force fatal error.
  //   defaultScenario(server);

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');

    const defaultRoute = 'food';
    assert.equal(currentRouteName(), `${defaultRoute}_error`, 'Entered default route error substate');

    const errorMessage = find('.error').text().trim();
    assert.ok(errorMessage.indexOf('nom nom') >= 0, `Error message: "${errorMessage}"`);
  });
});

['food', 'cocktails'].forEach(function(section) {
  test(`${section} detail page 404`, function(assert) {
    assert.expect(3);

    defaultScenario(server);

    const unlikelyDetailRoute = `/${section}/unlikely-restaurant-name`;

    visit(unlikelyDetailRoute);

    andThen(function() {
      assert.equal(currentURL(), unlikelyDetailRoute);
      assert.equal(currentRouteName(), `${section}.item_error`, 'Entered detail route error substate');

      const errorMessage = find('.error').text().trim();
      assert.ok(errorMessage.indexOf('couldn\'t find that one') >= 0, `Error message: "${errorMessage}"`);
    });
  });
});
