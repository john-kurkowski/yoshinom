import Mirage from 'ember-cli-mirage';

import { YOSHINOM_SHEETS_ID } from 'yoshinom/services/spreadsheet';

export default function() {
  this.get('https://spreadsheets.google.com/feeds/worksheets/:appId/public/values', function(db, request) {
    const { appId } = request.params;
    if (appId !== YOSHINOM_SHEETS_ID) {
      return new Mirage.Response(404);
    }

    return {
      feed: {
        entry: db.sheets
      }
    };
  });

  this.get('https://spreadsheets.google.com/feeds/list/:sheetId/od7/public/values', function(db, request) {
    const { sheetId } = request.params;
    const yoshinomItems = db['yoshinom-items']
      .where({
        sheet_id: sheetId // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      });
    if (!yoshinomItems.length) {
      return new Mirage.Response(404);
    }

    return {
      feed: {
        entry: yoshinomItems
      }
    };
  });
}
