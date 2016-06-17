import Ember from 'ember';
import EmberObject from 'ember-object';

const { computed } = Ember;

/**
 * A generic top-level item in the Yoshinom ecosystem, such as a restaurant or
 * cocktail.
 *
 * Usually persisted as a spreadsheet row.
 *
 * @public
 */
export default EmberObject.extend({

  name: '',
  tags: [],
  images: [],
  image: '',
  imageLink: '',
  review: '',

  imageAlt: computed.reads('name')

});
