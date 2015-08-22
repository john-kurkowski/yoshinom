import Ember from 'ember';
import _ from 'lodash';

/**
 * Base route for a section of the site, rendering a list of items, e.g.
 * restaurants, or cocktails.
 */
export default Ember.Route.extend({

  spreadsheet: Ember.inject.service(),

  titleToken: '',
  sorts: [],

  templateName: 'section',

  descriptionForQuery: function(/*q*/) {
    throw new Ember.Error('Routes extending SectionRoute must specify descriptionForQuery(q: {String}) -> {String}.');
  },

  queryParams: {
    q: { refreshModel: true },
    s: { refreshModel: true }
  },

  model: function(params) {
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
      tags: tags
    });
  },

  setupController: function(controller, model) {
    controller.setProperties({
      indexRoute: this.routeName,
      itemRoute: `${this.routeName}.item`,
      model: model.items,

      // TODO: this shims old ArrayController properties, but mixins &
      //       controllers are misaligned with "everything should be a component"
      //       http://discuss.emberjs.com/t/ember-1-13-2-arraycontroller-replacement/8289/21
      arrangedContent: Ember.ArrayProxy.extend(Ember.SortableMixin).create({
        sortProperties: model.sorts,
        sortAscending: false,
        content: model.items
      }),

      tags: model.tags
    });

    this._updateMetaDescription();
  },

  _updateMetaDescription: function() {
    const controller = this.controllerFor(this.routeName);
    const q = controller.get('q');
    const description = this.descriptionForQuery(q);
    const sectionImages = controller.get('model').mapBy('images.firstObject').compact();
    this.send('updateMetaDescription', description, sectionImages);
  },

  actions: {

    toggleItem: function(item) {
      const showItem = item.get('showDetails');
      if (showItem) {
        this.transitionTo(`${this.routeName}.item`, item);
      } else {
        this._updateMetaDescription();
      }
    },

    updateMetaDescription: function(description/*, imageUrls*/) {
      if (description) {
        return true;
      } else {
        this._updateMetaDescription();
        return false;
      }
    }

  }

});
