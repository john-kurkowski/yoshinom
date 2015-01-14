import Ember from 'ember';
import _ from 'lodash';

/**
 * Base route for a section of the site, rendering a list of items, e.g.
 * restaurants, or cocktails.
 */
export default Ember.Route.extend({

  titleToken: '',
  sorts: [],

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

    const spreadsheetPromise = this.container.lookup('service:spreadsheet').find(sheetTitle);

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
      return _(items)
      .map('tags')
      .flatten()
      .groupBy()
      .map(function(group, tagName) {
        return { name: tagName, count: group.length };
      })
      .sortBy('name')
      .value();
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
      itemRoute: this.routeName + ".item",
      model: model.items,
      sortProperties: model.sorts,
      sortAscending: false,
      tags: model.tags
    });
  },

  renderTemplate: function() {
    this.render('section-subnav', {
      outlet: 'subnav'
    });
    this.render('card-list');
  },

  actions: {

    toggleItem: function(item) {
      const showItem = item.get('showDetails');
      if (showItem) {
        this.transitionTo(this.routeName + '.item', item);
      }
    }

  }

});
