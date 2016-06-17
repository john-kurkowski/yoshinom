import Ember from 'ember';
import _ from 'lodash/lodash';

const { copy, Error: EmberError, inject, Route, RSVP } = Ember;

import YoshinomSectionModel from './model';

/**
 * Abstract base route for a section of the site, rendering a list of items,
 * e.g. restaurants, or cocktails.
 *
 * Extending routes must override
 *
 * 1. `titleToken` - to know which sheet of the spreadsheet the route
 *    corresponds to
 * 2. `descriptionForQuery` - to update the <meta> description of the current
 *    route
 *
 * Other overridable properties:
 *
 * 1. `sorts` - the possible and default sort of the section's sheet
 *
 * @protected
 */
export default Route.extend({

  spreadsheet: inject.service(),

  titleToken: '',
  sorts: [],

  templateName: 'yoshinom-section',

  descriptionForQuery(/*q*/) {
    throw new EmberError('Routes extending SectionRoute must specify descriptionForQuery(q: {String}) -> {String}.');
  },

  queryParams: {
    q: { refreshModel: true },
    s: { refreshModel: true }
  },

  model(params) {
    const sheetTitle = this.get('titleToken');
    const errors = [];

    if (!sheetTitle) {
      errors.push('Routes extending SectionRoute must specify a titleToken.');
    }
    if (errors.length) {
      throw new EmberError(errors.join('\n'));
    }

    const spreadsheetPromise = this.get('spreadsheet').find(sheetTitle);

    return RSVP.hash({
        indexRoute: this.routeName,
        itemRoute: `${this.routeName}.item`,
        items: this._filterItems(spreadsheetPromise, params),
        sorts: this._selectedSorts(params),
        tags: this._tags(spreadsheetPromise)
      })
      .then(YoshinomSectionModel.create.bind(YoshinomSectionModel));
  },

  afterModel() {
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

  },

  /**
   * Filter Yoshinom spreadsheet items per the user's parameters.
   *
   * 1. If params.q is specified, includes only items with tags matching
   *    params.q.
   *
   * @private
   */
  _filterItems(spreadsheetPromise, params) {
    if (params.q) {
      return spreadsheetPromise.then(function(items) {
        return items.filter(function(item) {
          return (item.get('tags') || []).contains(params.q);
        });
      });
    } else {
      return spreadsheetPromise;
    }
  },

  /**
   * Sorts to be applied on a Controller via computed.sort.
   *
   * @private
   */
  _selectedSorts(params) {
    const sorts = this.get('sorts');
    const selectedSort = params.s || this.controllerFor(this.routeName).get('s');
    const selectedSorts = copy(sorts);
    if (selectedSorts.contains(selectedSort)) {
      selectedSorts.removeObject(selectedSort);
      selectedSorts.unshift(selectedSort);
    }
    return selectedSorts;
  },

  /**
   * Count all distinct tags in the Yoshinom spreadsheet.
   *
   * @private
   */
  _tags(spreadsheetPromise) {
    return spreadsheetPromise
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
  }

});
