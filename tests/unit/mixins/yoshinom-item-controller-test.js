import Ember from 'ember';
import { test, module } from 'qunit';

import YoshinomItemControllerMixin from 'yoshinom/mixins/yoshinom-item-controller';

module('YoshinomItemControllerMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  const YoshinomItemListControllerObject = Ember.Object.extend(YoshinomItemControllerMixin);
  const subject = YoshinomItemListControllerObject.create();
  assert.ok(subject);
});
