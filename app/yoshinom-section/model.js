import Ember from 'ember';

/**
 * Properties common to all Yoshinom sections.
 *
 * @public
 */
export default Ember.Object.extend({

  directLinkToName: '',
  indexRoute: '',
  itemRoute: '',
  items: [],
  sorts: [],
  tags: []

});
