import { test, module } from 'qunit';

import {
  getOrElse
} from 'yoshinom/helpers/get-or-else';

module('GetOrElseHelper');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = getOrElse(42);
  assert.ok(result);
});
