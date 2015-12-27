import { Factory, faker } from 'ember-cli-mirage';

const localFaker = faker.makeNewInstance();
localFaker.seed(1);

/**
 * Google Sheets sheet factory.
 *
 * @protected
 */
export default Factory.extend({

  title: {
    $t: localFaker.name.jobArea
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
