import { faker } from 'ember-cli-mirage';
import flatten from 'lodash/array/flatten';

export default function(server) {
  faker.seed(1);

  // Food

  // TODO: app should not rely on a magical value present in its data
  const recordsWithHardcodedDefaultTag = server.createList('yoshinomItem', 4, {
    sheet_id: 'Food' // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });

  recordsWithHardcodedDefaultTag.forEach(function(record) {
    const hardcodedDefaultTag = 'West LA';
    record.fields.Tags.push(hardcodedDefaultTag);
  });

  const recordsWithMissingImage = recordsWithHardcodedDefaultTag.slice(2, 3);
  recordsWithMissingImage.forEach(function(record) {
    record.fields.Images = '/non-existent.jpg';
  });

  server.createList('yoshinomItem', 6, {
    sheet_id: 'Food' // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });

  // Cocktails

  server.createList('yoshinomItem', 10, {
    sheet_id: 'Cocktails' // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
  });

  const recordsToUpdate = flatten([
    recordsWithHardcodedDefaultTag,
    recordsWithMissingImage
  ]);
  recordsToUpdate.forEach(function putRecord(record) {
    server.db.yoshinomItems.update(record.id, record);
  });
}
