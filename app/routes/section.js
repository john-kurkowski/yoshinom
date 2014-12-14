import Ember from 'ember';

/**
 * Base route for a section of the site, rendering a list of items, e.g.
 * restaurants, or cocktails.
 */
export default Ember.Route.extend({

  sheetNumber: -1,
  sorts: [],

  controllerName: 'venue-list',

  queryParams: {
    q: { refreshModel: true },
    s: { refreshModel: true }
  },

  model: function(params) {
    var sheetNumber = this.get('sheetNumber');
    var sorts = this.get('sorts');
    var errors = [];
    var filteredItems;
    var selectedSorts;

    if (sheetNumber < 0 || (!sheetNumber && sheetNumber !== 0)) {
      errors.push('Routes extending SectionRoute must specify a sheetNumber, not ' + sheetNumber + '.');
    }
    if (!sorts.length) {
      errors.push('Routes extending SectionRoute specify an array of properties to sort upon, in order.');
    }
    if (errors.length) {
      throw new Ember.Error(errors.join('\n'));
    }

    filteredItems = this.container.lookup('service:spreadsheet').find(sheetNumber)
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
    if (selectedSorts.contains(params.s)) {
      selectedSorts.removeObject(params.s);
      selectedSorts.unshift(params.s);
    }

    return Ember.RSVP.hash({
      items: filteredItems,
      sorts: selectedSorts
    });
  },

  setupController: function(controller, model) {
    controller.setProperties({
      itemRoute: this.routeName + ".item",
      model: model.items,
      sortProperties: model.sorts,
      sortAscending: false
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
