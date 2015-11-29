import Ember from 'ember';
import { test, module } from 'qunit';

import YoshinomSectionControllerMixin from 'yoshinom/mixins/yoshinom-section-controller';

module('YoshinomSectionControllerMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  const YoshinomSectionController = Ember.Controller.extend(YoshinomSectionControllerMixin);
  const subject = YoshinomSectionController.create();
  assert.ok(subject);
});
