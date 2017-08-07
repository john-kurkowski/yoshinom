import Mirage from 'ember-cli-mirage';

const SOME_OFFSET = 'abcdef123456';

export default function() {
  this.get('https://api.airtable.com/v0/appwg2eHszZjuZh69/:sheetId', function(schema, request) {
    const {
      params: {
        sheetId,
      },
      queryParams: {
        offset,
      },
    } = request;

    const yoshinomItems = schema.db.yoshinomItems
      .where({
        sheet_id: sheetId, // eslint-disable-line camelcase
      });

    let nextOffset, records;
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
      records,
    };
  });
}
