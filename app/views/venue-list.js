import Ember from 'ember';

export default Ember.View.extend({

  scrollToDirectLink: function() {
    var $scrollTo;

    if (!(this.get('controller.isDirectLink') && this.get('controller.areImagesLoaded'))) {
      return;
    }

    this.set('controller.isDirectLink', false);
    Ember.run.schedule('afterRender', this, function() { // why is this necessary?
      this.set('controller.showDetails', true);
    });

    $scrollTo = Ember.$(".venue .name:contains(" + this.get('controller.name') + ")").closest('.venue');
    Ember.run.scheduleOnce('afterRender', this, '_scrollTo', $scrollTo);
  }.observes('controller.{isDirectLink,areImagesLoaded}'),

  _scrollTo: function($element) {
    var buffer = 32;
    Ember.$('html, body').animate({
      scrollTop: $element.offset().top - buffer
    }, 1000);
  }

});
