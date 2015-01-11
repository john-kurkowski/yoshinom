import Ember from 'ember';
import request from 'ic-ajax';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

var sheets = {};

export default Ember.Object.extend({

  find: function(sheetNumber) {
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
      return spreadsheet.feed.entry
      .map(parseSpreadsheetEntry)
      .map(parseVenuePromise);
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

function parseVenuePromise(venue) {
  var firstImage;
  var isInstagramShortlink;

  venue.ratings = {
    food: venue.food,
    service: venue.service,
    atmosphere: venue.atmosphere,
    uniqueness: venue.uniqueness,
    bathroom: venue.bathroom
  };

  firstImage = venue.images[0];
  isInstagramShortlink = /http:\/\/instagr\.?am(\.com)?/.test(firstImage);
  if (isInstagramShortlink) {
    venue.imageLink = firstImage;
    venue.image = firstImage + "/media?size=l";
  } else {
    venue.image = firstImage;
  }
  return YoshinomItem.create(venue);
}
