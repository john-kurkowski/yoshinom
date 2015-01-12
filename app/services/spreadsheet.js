import Ember from 'ember';
import request from 'ic-ajax';
import _ from 'lodash';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

var sheets = {};

export default Ember.Object.extend({

  find: function(sheetNumber) {
    var self = this;
    var url;

    if (sheets[sheetNumber]) {
      return sheets[sheetNumber];
    }

    url = 'https://spreadsheets.google.com/feeds/list/0AqhwsCsZYnVDdHBnMTBuUjFWRVNnZFo4V2xtRW5HLUE/' + sheetNumber + '/public/values';
    return sheets[sheetNumber] = request(url, {
      data: {
        alt: 'json'
      }
    })
    .then(function(spreadsheet) {
      var title = spreadsheet.feed.title.$t;
      var model = self.container.lookup('model:' + title.dasherize() + '-item');
      var itemClass = (model && model.constructor) || YoshinomItem;

      var rawItems = spreadsheet.feed.entry;
      return rawItems
      .map(parseSpreadsheetEntry)
      .map(_.curry(parseYoshinomItemPromise)(itemClass));
    });
  }

});

function parseSpreadsheetEntry(entry) {
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
