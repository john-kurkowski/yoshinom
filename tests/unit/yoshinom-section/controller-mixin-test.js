import Ember from 'ember';
import { test, module } from 'qunit';

const { Controller } = Ember;

import YoshinomSectionControllerMixin from 'yoshinom/yoshinom-section/controller-mixin';

module('YoshinomSectionControllerMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  const YoshinomSectionController = Controller.extend(YoshinomSectionControllerMixin);
  const subject = YoshinomSectionController.create();
  assert.ok(subject);
});
