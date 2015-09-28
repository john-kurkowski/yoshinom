import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({

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
