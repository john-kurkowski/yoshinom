import moduleForAcceptance from '../helpers/module-for-acceptance';
import QUnit from 'qunit';

import { createSheets} from 'yoshinom/mirage/scenarios/default';

moduleForAcceptance('Acceptance | error', {
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
