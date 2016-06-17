import EmberObject from 'ember-object';

/**
 * Properties common to all Yoshinom sections.
 *
 * @public
 */
export default EmberObject.extend({

  directLinkToName: '',
  indexRoute: '',
  itemRoute: '',
  items: [],
  sorts: [],
  tags: []

});
