import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['food', 'cocktails'],

  setPrerenderReady: function() {
    var controllers = [
      this.get('controllers.food'),
      this.get('controllers.cocktails')
    ];
    var isRequestedPageSpinnerFree = controllers.anyBy('areImagesLoaded');
    if (isRequestedPageSpinnerFree) {
      Ember.run.scheduleOnce('afterRender', function() {
        window.prerenderReady = true;
      });
    }
  }.observes(
    'controllers.food.areImagesLoaded',
    'controllers.cocktails.areImagesLoaded'
  ).on('init'),

  isDrinking: function() {
    return /cocktails/.test(this.get('currentPath'));
  }.property('currentPath')

});
