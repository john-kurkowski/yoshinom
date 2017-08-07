import { test, module } from 'qunit';

import {
  getOrElse,
} from 'yoshinom/helpers/get-or-else';

module('GetOrElseHelper');

test('it works', function(assert) {
  assert.strictEqual(getOrElse(42, 2501), 42,   'Handle truthy 1st param.');
  assert.strictEqual(getOrElse('', 2501), 2501, 'Handle falsy 1st param.');
});
