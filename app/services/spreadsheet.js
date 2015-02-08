import Ember from 'ember';
import request from 'ic-ajax';
import _ from 'lodash';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

let sheets = [];
const sheetsByTitle = {};

export default Ember.Object.extend({

  find: function(sheetTitle) {
    if (sheetsByTitle[sheetTitle]) {
      return sheetsByTitle[sheetTitle];
    }

    return sheetsByTitle[sheetTitle] = allSheets()
    .then(function(sheets) {
      return rowsForSheet(sheets.findBy('title.$t', sheetTitle));
    })
    .then(rows => {
      const model = this.container.lookup(`model:${sheetTitle.dasherize()}-item`);
      const itemClass = (model && model.constructor) || YoshinomItem;

      return rows
      .map(parseRow)
      .map(_.curry(parseYoshinomItemPromise)(itemClass));
    });
  }

});

function allSheets() {
  if (sheets.length) {
    return Ember.RSVP.resolve(sheets);
  } else {
    const url = 'https://spreadsheets.google.com/feeds/worksheets/0AqhwsCsZYnVDdHBnMTBuUjFWRVNnZFo4V2xtRW5HLUE/public/values';
    return request(url, { data: { alt: 'json' } })
    .then(function(sheetsResponse) {
      sheets = sheetsResponse.feed.entry;
      return sheets;
    });
  }
}

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
  return _.reduce(entry, function(acc, cell, key) {
    const [, normalizedKey] = gsxRegex.exec(key) || [];
    if (!normalizedKey) {
      return acc;
    }

    const text = cell.$t;
    const value = (function() {
      switch (normalizedKey) {
        case 'images' :  return text.split(/\s+/);
        case 'tags'   :  return text.split(/\n/);
        default       :  return text;
      }
    })();
    acc[normalizedKey] = value;
    return acc;
  }, {});
}

function parseYoshinomItemPromise(itemClass, item) {
  const firstImage = item.images[0];
  const isInstagramShortlink = /http:\/\/instagr\.?am(\.com)?/.test(firstImage);
  if (isInstagramShortlink) {
    item.imageLink = firstImage;
    item.image = `${firstImage.replace(/\/$/, '')}/media?size=l`;
  } else {
    item.image = firstImage;
  }

  if (itemClass.fromSpreadsheetRow) {
    return itemClass.fromSpreadsheetRow(item);
  } else {
    return itemClass.create(item);
  }
}
