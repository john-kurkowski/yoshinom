import Mirage from 'ember-cli-mirage';

export default function() {
  this.get('https://api.airtable.com/v0/appwg2eHszZjuZh69/:sheetId', function(db, request) {
    const { sheetId } = request.params;
    const yoshinomItems = db.yoshinomItems
      .where({
        sheet_id: sheetId // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      });
    if (!yoshinomItems.length) {
      return new Mirage.Response(404);
    }

    return {
      records: yoshinomItems
    };
  });
}
