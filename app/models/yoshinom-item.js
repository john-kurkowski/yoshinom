import Ember from 'ember';

const { computed } = Ember;

/**
 * A generic top-level item in the Yoshinom ecosystem, such as a restaurant or
 * cocktail.
 *
 * Usually persisted as a spreadsheet row.
 *
 * @public
 */
export default Ember.Object.extend({

  name: '',
  tags: [],
  images: [],
  image: '',
  imageLink: '',
  review: '',

  imageAlt: computed.reads('name')

});
