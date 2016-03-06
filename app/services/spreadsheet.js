import Ember from 'ember';
import identity from 'lodash/utility/identity';
import mapKeys from 'lodash/object/mapKeys';
import mapValues from 'lodash/object/mapValues';
import partial from 'lodash/function/partial';

const { computed, getOwner, inject, Service } = Ember;

import YoshinomItem from 'yoshinom/models/yoshinom-item';

const READ_ONLY_API_KEY = 'keyqXVAT2U5xdynJb';

/**
 * Adapt database responses to Yoshinom model objects.
 *
 * @public
 */
export default Service.extend({

  ajax: inject.service(),

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

    const spreadsheetPromise = this._rowsForSheet(sheetTitle)
    .then((rows) => {
      const model = getOwner(this).lookup(`model:${sheetTitle.dasherize()}-item`);
      const itemClass = (model && model.constructor) || YoshinomItem;

      return rows
      .map(toEmberFriendlyObject)
      .map(partial(mapValues, partial.placeholder, parseCell))
      .map(partial(parseYoshinomItemPromise, itemClass, this.get('_isSecure')));
    });

    this.set(`_sheetsByTitle.${sheetTitle}`, spreadsheetPromise);

    return spreadsheetPromise;
  },

  _rowsForSheet(sheetTitle) {
    const url = `https://api.airtable.com/v0/appwg2eHszZjuZh69/${sheetTitle}`;
    return this.get('ajax').request(url, {
      headers: {
        'Authorization': `Bearer ${READ_ONLY_API_KEY}`,
        'X-API-VERSION': '0.1.0'
      }
    })
    .then((sheet) => sheet.records);
  },

  _isSecure: computed(function() {
    return window.location.protocol === 'https:';
  })

});

/*
  Flatten the object returned by the database to be more like a POJO that Ember
  expects.
*/
function toEmberFriendlyObject(record) {
  const newObject = mapKeys(record.fields, function withEmberFriendlyKeys(v, k) {
    return Ember.String.camelize(k);
  });
  newObject.id = record.id;
  return newObject;
}

/*
  Cell-specific transformations, common to all Yoshinom item types.
*/
function parseCell(text, key) {
  return (function() {
    switch (key) {
      case 'images' :  return text
                              .split(/\s+/)
                              .map(function(t) {
                                return t.trim();
                              })
                              .filter(identity);
      default       :  return text;
    }
  })();
}

/*
  Convert the item into the specified Yoshinom class.
*/
function parseYoshinomItemPromise(itemClass, isSecure, item) {
  if (isSecure) {
    item.images = item.images.map(function(image) {
      return image
        .replace(/^http:/, 'https:')
        .replace(/instagr.am\//, 'instagram.com/');
    });
  }

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
