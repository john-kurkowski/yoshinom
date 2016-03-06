import constant from 'lodash/utility/constant';
import { Factory, faker } from 'ember-cli-mirage';
import partial from 'lodash/function/partial';
import times from 'lodash/utility/times';

/**
 * Single row of the database, with Yoshinom's idiosyncratic schema for e.g.
 * restaurants, cocktails. Ultimately displayed in the UI as a card.
 *
 * @protected
 */
export default Factory.extend({

  id: faker.internet.password,

  fields: {

    Name: faker.company.companyName,

    Tags() {
      return times(oneToFive(), partial(faker.random.arrayElement, [
          'dynamic',
          'heuristic',
          'needs-based',
          'next-generation',
          'optimal',
          'scalable',
          'synergistic',
          'value-added',
          'viral',
          'zero defect'
        ]))
        .uniq();
    },

    Images(i) {
      const pseudoRandomNightlife = function() {
        return `http://lorempixel.com/640/480/nightlife/${i % 11}`;
      };
      return times(oneToFive(), pseudoRandomNightlife).join('\n');
    },

    Price() {
      return times(oneToFive(), constant('$')).join('');
    },

    Food: oneToFive,

    Drink: oneToFive,

    Service: oneToFive,

    Atmosphere: oneToFive,

    Uniqueness: oneToFive,

    Bathroom: oneToFive,

    Review() {
      const n = (faker.random.number() % 2) + 1;
      return faker.lorem.paragraphs(n, '@@@')
        .replace(/\n/g, ' ')
        .replace(/@@@/g, '\n');
    }

  }

});

function oneToFive() {
  return (faker.random.number() % 5) + 1;
}
