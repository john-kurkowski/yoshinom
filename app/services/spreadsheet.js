import curry from 'lodash/function/curry';
import Ember from 'ember';
import identity from 'lodash/utility/identity';
import reduce from 'lodash/collection/reduce';
import request from 'ic-ajax';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

let sheets = [];
const sheetsByTitle = {};

export default Ember.Service.extend({

  find(sheetTitle) {
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
      .map(curry(parseYoshinomItemPromise)(itemClass));
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
  return reduce(entry, function(acc, cell, key) {
    const [, normalizedKey] = gsxRegex.exec(key) || [];
    if (!normalizedKey) {
      return acc;
    }

    const text = cell.$t;
    const value = (function() {
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
    acc[normalizedKey] = value;
    return acc;
  }, {});
}

function parseYoshinomItemPromise(itemClass, item) {
  const instagramRegex = /http:\/\/instagr\.?am(\.com)?/;

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
