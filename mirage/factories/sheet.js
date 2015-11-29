import { Factory, faker } from 'ember-cli-mirage';

/**
 * Google Sheets sheet factory.
 *
 * @protected
 */
export default Factory.extend({

  title: {
    $t: faker.name.jobArea
  },

  link: [
    {
      rel: 'http://schemas.google.com/spreadsheets/2006#listfeed',
      href(i) {
        const id = i + 1;
        return `https://spreadsheets.google.com/feeds/list/${id}/od7/public/values`;
      }
    }
  ]

});
