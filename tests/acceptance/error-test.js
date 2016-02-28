import Ember from 'ember';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import sinon from 'sinon';
import { test } from 'qunit';

const { Test } = Ember;

import { createSheets} from 'yoshinom/mirage/scenarios/default';

moduleForAcceptance('Acceptance | error', {
  beforeEach() {
    this.sandbox = sinon.sandbox.create();

    /**
     * Override Ember.Test's default failure on uncaught errors.
     *
     * @private
     */
    this.sandbox.stub(Test.adapter, 'exception');
  },

  afterEach() {
    this.sandbox.restore();
  }
});

test('section page error', function(assert) {
  assert.expect(3);

  // Don't createSheets to force fatal error.
  //   createSheets(server);

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');

    const defaultRoute = 'food';
    assert.equal(currentRouteName(), `${defaultRoute}_error`);

    const errorMessage = find('.error').text().trim();
    assert.ok(errorMessage.indexOf('nom nom') >= 0, `Error message: "${errorMessage}"`);
  });
});

test('detail page 404', function(assert) {
  assert.expect(3);

  createSheets(server);

  const unlikelyDetailRoute = '/food/unlikely-restaurant-name';

  visit(unlikelyDetailRoute);

  andThen(function() {
    assert.equal(currentURL(), unlikelyDetailRoute);
    assert.equal(currentRouteName(), 'food.item_error');

    const errorMessage = find('.error').text().trim();
    assert.ok(errorMessage.indexOf('couldn\'t find that one') >= 0, `Error message: "${errorMessage}"`);
  });
});
