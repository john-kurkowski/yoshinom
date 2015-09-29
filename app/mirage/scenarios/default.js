import { faker } from 'ember-cli-mirage';

import YoshinomItemFactory from 'yoshinom/mirage/factories/yoshinom-item';

export default function(server) {
  faker.seed(1);

  // Food

  const foodSheet = server.create('sheet', {
    title: {
      $t: 'Food'
    }
  });

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

  const cocktailsSheet = server.create('sheet', {
    title: {
      $t: 'Cocktails'
    }
  });

  server.createList('yoshinom-item', 10, {
    sheet_id: cocktailsSheet.id // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });
}
