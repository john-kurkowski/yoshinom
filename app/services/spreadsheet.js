import curry from 'lodash/function/curry';
import Ember from 'ember';
import identity from 'lodash/utility/identity';
import reduce from 'lodash/collection/reduce';
import request from 'ic-ajax';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

export const YOSHINOM_SHEETS_ID = '0AqhwsCsZYnVDdHBnMTBuUjFWRVNnZFo4V2xtRW5HLUE';

/**
 * Adapt Google Sheets responses, with Yoshinom's idiosyncratic row schema, to
 * Yoshinom model objects.
 *
 * @public
 */
export default Ember.Service.extend({

  _sheets: Ember.computed(function() {
    return [];
  }),

  _sheetsByTitle: Ember.computed(function() {
    return {};
  }),

  find(sheetTitle) {
    const cachedSheet = this.get(`_sheetsByTitle.${sheetTitle}`);
    if (cachedSheet) {
      return cachedSheet;
    }

    const spreadsheetPromise = this._allSheets()
    .then(function(sheets) {
      return rowsForSheet(sheets.findBy('title.$t', sheetTitle));
    })
    .then((rows) => {
      const model = this.container.lookup(`model:${sheetTitle.dasherize()}-item`);
      const itemClass = (model && model.constructor) || YoshinomItem;

      return rows
      .map(parseRow)
      .map(curry(parseYoshinomItemPromise)(itemClass));
    });

    this.set(`_sheetsByTitle.${sheetTitle}`, spreadsheetPromise);

    return spreadsheetPromise;
  },

  _allSheets() {
    let sheets = this.get('_sheets');
    if (sheets.length) {
      return Ember.RSVP.resolve(sheets);
    } else {
      const url = `https://spreadsheets.google.com/feeds/worksheets/${YOSHINOM_SHEETS_ID}/public/values`;
      return request(url, { data: { alt: 'json' } })
      .then((sheetsResponse) => {
        sheets = sheetsResponse.feed.entry;
        this.set('_sheets', sheets);
        return sheets;
      });
    }
  }

});

function rowsForSheet(sheetEntry) {
  const url = sheetEntry.link.find(function(link) {
    return /#listfeed$/.test(link.rel);
  }).href;

  return request(url, { data: { alt: 'json' } })
  .then(function(sheet) {
    const rows = sheet.feed.entry;
    return rows;
  });
}

function parseRow(entry) {
  const gsxRegex = /^gsx\$(.+)/;
  return reduce(entry, function(acc, cell, key) {
    const [, normalizedKey] = gsxRegex.exec(key) || [];
    if (normalizedKey) {
      acc[normalizedKey] = parseCell(normalizedKey, cell);
    }
    return acc;
  }, {});
}

function parseCell(normalizedKey, cell) {
  const text = cell.$t;
  return (function() {
    switch (normalizedKey) {
      case 'images' :  return text
                              .split(/\s+/)
                              .map(function(t) {
                                return t.trim();
                              })
                              .filter(identity);
      case 'tags'   :  return text
                              .split(/\n/)
                              .map(function(t) {
                                return t.trim();
                              })
                              .filter(identity);
      default       :  return text;
    }
  })();
}

function parseYoshinomItemPromise(itemClass, item) {
  const instagramRegex = /https?:\/\/instagr\.?am(\.com)?/;

  const [firstImage] = item.images;
  const isInstagramShortlink = instagramRegex.test(firstImage);
  if (isInstagramShortlink) {
    item.imageLink = firstImage;
    item.image = `${firstImage.replace(/\/$/, '')}/media?size=l`;
  } else {
    item.image = firstImage;
  }

  item.images = item.images.map(function(image) {
    return instagramRegex.test(image) ? `${image.replace(/\/$/, '')}/media?size=l` : image;
  });

  if (itemClass.fromSpreadsheetRow) {
    return itemClass.fromSpreadsheetRow(item);
  } else {
    return itemClass.create(item);
  }
}
