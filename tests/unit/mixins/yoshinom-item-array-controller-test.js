import Ember from 'ember';
import { test, module } from 'qunit';

import YoshinomItemArrayControllerMixin from 'yoshinom/mixins/yoshinom-item-array-controller';

module('YoshinomItemArrayControllerMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var YoshinomItemListControllerObject = Ember.Object.extend(YoshinomItemArrayControllerMixin);
  var subject = YoshinomItemListControllerObject.create();
  assert.ok(subject);
});
