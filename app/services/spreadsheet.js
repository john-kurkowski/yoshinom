import Ember from 'ember';
import request from 'ic-ajax';
import _ from 'lodash';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

var sheets = [];
var sheetsByTitle = {};

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
      var model = this.container.lookup('model:' + sheetTitle.dasherize() + '-item');
      var itemClass = (model && model.constructor) || YoshinomItem;

      return rows
      .map(parseRow)
      .map(_.curry(parseYoshinomItemPromise)(itemClass));
    });
  }

});

function allSheets() {
  var url;
  if (sheets.length) {
    return Ember.RSVP.resolve(sheets);
  } else {
    url = 'https://spreadsheets.google.com/feeds/worksheets/0AqhwsCsZYnVDdHBnMTBuUjFWRVNnZFo4V2xtRW5HLUE/public/values';
    return request(url, { data: { alt: 'json' } })
    .then(function(sheetsResponse) {
      sheets = sheetsResponse.feed.entry;
      return sheets;
    });
  }
}

function rowsForSheet(sheetEntry) {
  var url = sheetEntry.link.find(function(link) {
    return /#listfeed$/.test(link.rel);
  }).href;

  return request(url, { data: { alt: 'json' } })
  .then(function(sheet) {
    var rows = sheet.feed.entry;
    return rows;
  });
}

function parseRow(entry) {
  var gsxRegex = /^gsx\$/;
  var keys = Ember.keys(entry).filter(function(key) { return gsxRegex.test(key); });
  return keys.reduce(function(acc, key) {
    var normalizedKey = key.replace(gsxRegex, '');
    var text = entry[key]['$t'];
    var value = (function() {
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
  var firstImage;
  var isInstagramShortlink;

  item.ratings = {
    food: item.food,
    service: item.service,
    atmosphere: item.atmosphere,
    uniqueness: item.uniqueness,
    bathroom: item.bathroom
  };

  firstImage = item.images[0];
  isInstagramShortlink = /http:\/\/instagr\.?am(\.com)?/.test(firstImage);
  if (isInstagramShortlink) {
    item.imageLink = firstImage;
    item.image = firstImage + "/media?size=l";
  } else {
    item.image = firstImage;
  }
  return itemClass.create(item);
}
