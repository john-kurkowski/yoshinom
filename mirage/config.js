import Mirage from 'ember-cli-mirage';

const SOME_OFFSET = 'abcdef123456';

export default function() {
  this.get('https://api.airtable.com/v0/appwg2eHszZjuZh69/:sheetId', function(db, request) {
    const {
      params: {
        sheetId
      },
      queryParams: {
        offset
      }
    } = request;

    const yoshinomItems = db.yoshinomItems
      .where({
        sheet_id: sheetId // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      });

    let nextOffset;
    let records;
    if (!yoshinomItems.length) {
      return new Mirage.Response(404);
    } else if (offset === SOME_OFFSET) {
      nextOffset = undefined;
      records = yoshinomItems.slice(8, yoshinomItems.length);
    } else if (!offset) {
      nextOffset = SOME_OFFSET;
      records = yoshinomItems.slice(0, 8);
    }

    return {
      offset: nextOffset,
      records
    };
  });
}
