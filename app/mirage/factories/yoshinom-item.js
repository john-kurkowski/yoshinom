import constant from 'lodash/utility/constant';
import Mirage, { faker } from 'ember-cli-mirage';
import partial from 'lodash/function/partial';
import times from 'lodash/utility/times';

export default Mirage.Factory.extend({

  gsx$name: {
    $t() {
      return faker.company.companyName();
    }
  },

  gsx$tags: {
    $t() {
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
        .uniq()
        .join('\n');
    }
  },

  gsx$geo1: {
    $t: faker.address.country
  },

  gsx$geo2: {
    $t: faker.address.city
  },

  gsx$images: {
    $t(i) {
      const pseudoRandomNightlife = function() {
        return `http://lorempixel.com/640/480/nightlife/${i % 11}`;
      };
      return times(oneToFive(), pseudoRandomNightlife).join('\n');
    }
  },

  gsx$price: {
    $t() {
      return times(oneToFive(), constant('$')).join('');
    }
  },

  gsx$food: {
    $t: oneToFive
  },

  gsx$drink: {
    $t: oneToFive
  },

  gsx$service: {
    $t: oneToFive
  },

  gsx$atmosphere: {
    $t: oneToFive
  },

  gsx$uniqueness: {
    $t: oneToFive
  },

  gsx$bathroom: {
    $t: oneToFive
  },

  gsx$review: {
    $t() {
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
