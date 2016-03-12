import { faker } from 'ember-cli-mirage';

export default function(server) {
  faker.seed(1);

  // Food

  // TODO: app should not rely on a magical value present in its data
  const recordsWithHardcodedDefaultTag = server.createList('yoshinomItem', 4, {
    sheet_id: 'Food' // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });
  recordsWithHardcodedDefaultTag.forEach(function putRecord(record) {
    const hardcodedDefaultTag = 'West LA';
    record.fields.Tags.push(hardcodedDefaultTag);
    server.db.yoshinomItems.update(record.id, record);
  });

  server.createList('yoshinomItem', 6, {
    sheet_id: 'Food' // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });

  // Cocktails

  server.createList('yoshinomItem', 10, {
    sheet_id: 'Cocktails' // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });
}
