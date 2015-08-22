import Ember from 'ember';
import _ from 'lodash';

import YoshinomSectionModel from 'yoshinom/models/yoshinom-section-model';

/**
 * Base route for a section of the site, rendering a list of items, e.g.
 * restaurants, or cocktails.
 *
 * @public
 */
export default Ember.Route.extend({

  spreadsheet: Ember.inject.service(),

  titleToken: '',
  sorts: [],

  templateName: 'section',

  descriptionForQuery(/*q*/) {
    throw new Ember.Error('Routes extending SectionRoute must specify descriptionForQuery(q: {String}) -> {String}.');
  },

  queryParams: {
    q: { refreshModel: true },
    s: { refreshModel: true }
  },

  model(params) {
    const sheetTitle = this.get('titleToken');
    const sorts = this.get('sorts');
    const selectedSort = params.s || this.controllerFor(this.routeName).get('s');
    const errors = [];

    if (!sheetTitle) {
      errors.push('Routes extending SectionRoute must specify a titleToken.');
    }
    if (errors.length) {
      throw new Ember.Error(errors.join('\n'));
    }

    const spreadsheetPromise = this.get('spreadsheet').find(sheetTitle);

    const filteredItems = spreadsheetPromise
    .then(function(items) {
      if (params.q) {
        return items.filter(function(item) {
          return (item.get('tags') || []).contains(params.q);
        });
      } else {
        return items;
      }
    });

    const selectedSorts = Ember.copy(sorts);
    if (selectedSorts.contains(selectedSort)) {
      selectedSorts.removeObject(selectedSort);
      selectedSorts.unshift(selectedSort);
    }

    const tags = spreadsheetPromise
    .then(function(items) {
      const spreadsheetTags = _(items)
      .map('tags')
      .flatten()
      .groupBy()
      .map(function(group, tagName) {
        return { name: tagName, displayName: tagName, count: group.length };
      })
      .sortBy('name')
      .value();

      const allTag = { name: '', displayName: 'Show All', count: items.length };

      return spreadsheetTags.concat([allTag]);
    });

    return Ember.RSVP.hash({
      items: filteredItems,
      sorts: selectedSorts,
      tags
    });
  },

  setupController(controller, model) {
    controller.setProperties({
      indexRoute: this.routeName,
      itemRoute: `${this.routeName}.item`,
      model: YoshinomSectionModel.create(model)
    });

    this._updateMetaDescription();
  },

  _updateMetaDescription() {
    const query = this.paramsFor(this.routeName).q;
    const description = this.descriptionForQuery(query);
    const sectionItems = this.modelFor(this.routeName).items;
    const sectionImages = sectionItems.mapBy('images.firstObject').compact();
    this.send('updateMetaDescription', description, sectionImages);
  },

  actions: {

    toggleItem(item) {
      const showItem = item.get('showDetails');
      if (showItem) {
        this.transitionTo(`${this.routeName}.item`, item);
      } else {
        this._updateMetaDescription();
      }
    },

    updateMetaDescription(description/*, imageUrls*/) {
      if (description) {
        return true;
      } else {
        this._updateMetaDescription();
        return false;
      }
    }

  }

});
