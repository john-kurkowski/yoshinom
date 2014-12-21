import Ember from 'ember';

/**
 * Base route for a section of the site, rendering a list of items, e.g.
 * restaurants, or cocktails.
 */
export default Ember.Route.extend({

  sheetNumber: -1,
  sorts: [],

  queryParams: {
    q: { refreshModel: true },
    s: { refreshModel: true }
  },

  model: function(params) {
    var sheetNumber = this.get('sheetNumber');
    var sorts = this.get('sorts');
    var selectedSort = params.s || this.controllerFor(this.routeName).get('s');
    var errors = [];
    var spreadsheetPromise;
    var filteredItems;
    var selectedSorts;
    var tags;

    if (sheetNumber < 0 || (!sheetNumber && sheetNumber !== 0)) {
      errors.push('Routes extending SectionRoute must specify a sheetNumber, not ' + sheetNumber + '.');
    }
    if (errors.length) {
      throw new Ember.Error(errors.join('\n'));
    }

    spreadsheetPromise = this.container.lookup('service:spreadsheet').find(sheetNumber);

    filteredItems = spreadsheetPromise
    .then(function(items) {
      if (params.q) {
        return items.filter(function(item) {
          return (item.get('tags') || []).contains(params.q);
        });
      } else {
        return items;
      }
    });

    selectedSorts = Ember.copy(sorts);
    if (selectedSorts.contains(selectedSort)) {
      selectedSorts.removeObject(selectedSort);
      selectedSorts.unshift(selectedSort);
    }

    tags = spreadsheetPromise
    .then(function(items) {
      var tags = items.reduce(function(acc, item) {
        acc.pushObjects(item.get('tags'));
        return acc;
      }, []).uniq();
      tags.sort();
      return tags;
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
    this.render('venue-list');
  },

  actions: {

    toggleVenue: function(venue) {
      var showItem = venue.get('showDetails');
      if (showItem) {
        this.transitionTo(this.routeName + '.item', venue);
      }
    }

  }

});
