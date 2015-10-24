import { faker } from 'ember-cli-mirage';
import _ from 'lodash/lodash';

import YoshinomItemFactory from 'yoshinom/mirage/factories/yoshinom-item';

export function createSheets(server) {
  return _(['food', 'cocktails'])
    .map(function(key) {
      const sheet = server.create('sheet', {
        title: {
          $t: s.titleize(key)
        }
      });

      return [`${key}Sheet`, sheet];
    })
    .zipObject()
    .value();
}

export default function(server) {
  faker.seed(1);

  const {
    foodSheet,
    cocktailsSheet
  } = createSheets(server);

  // Food

  // TODO: app should not rely on a magical value present in its data
  server.createList('yoshinom-item', 4, {
    sheet_id: foodSheet.id, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    gsx$tags: {
      $t() {
        const factoryTags = YoshinomItemFactory.attrs.gsx$tags.$t();
        const hardcodedDefaultTag = 'West LA';
        return [factoryTags, hardcodedDefaultTag].join('\n');
      }
    }
  });

  server.createList('yoshinom-item', 6, {
    sheet_id: foodSheet.id // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });

  // Cocktails

  server.createList('yoshinom-item', 10, {
    sheet_id: cocktailsSheet.id // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });
}
