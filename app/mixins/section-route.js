import Ember from 'ember';

export default Ember.Mixin.create({

  sheetNumber: -1,

  model: function() {
    var sheetNumber = this.get('sheetNumber');
    if (sheetNumber < 0) {
      throw new Ember.Error('Routes that mixin ' + this.constructor + ' must specify a sheetNumber.');
    }

    return this.container.lookup('service:spreadsheet').find(sheetNumber);
  },

  setupController: function(controller, model) {
    controller.setProperties({
      itemRoute: this.routeName + ".item",
      model: model,
      sortProperties: ['ratings.food'], // TODO
      sortAscending: false
    });
  },

  renderTemplate: function() {
    this.render('venue-list');
  }

});
