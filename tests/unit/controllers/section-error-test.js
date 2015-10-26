import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:section-error', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it has the expected interface', function(assert) {
  const controller = this.subject();
  assert.notStrictEqual(controller.get('isNotFound'), undefined);
});
