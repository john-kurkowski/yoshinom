import Ember from 'ember';
import YoshinomItemArrayControllerMixin from 'yoshinom/mixins/yoshinom-item-array-controller';

module('YoshinomItemArrayControllerMixin');

// Replace this with your real tests.
test('it works', function() {
  var YoshinomItemListControllerObject = Ember.Object.extend(YoshinomItemArrayControllerMixin);
  var subject = YoshinomItemListControllerObject.create();
  ok(subject);
});
