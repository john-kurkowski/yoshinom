import Ember from 'ember';

export default Ember.View.extend({

  scrollToDirectLink: function() {
    var name = this.get('controller.directLinkToName');
    var $scrollTo;

    if (!(name && this.get('controller.areImagesLoaded'))) {
      return;
    }

    this.set('controller.directLinkToName', '');

    $scrollTo = Ember.$(".venue .name:contains(" + name + ")").closest('.venue');
    Ember.run.scheduleOnce('afterRender', this, '_scrollTo', $scrollTo);
  }.observes('controller.{directLinkToName,areImagesLoaded}'),

  _scrollTo: function($element) {
    var buffer = 32;
    var newTop = $element.offset().top - buffer;
    Ember.$('html, body').animate({
      scrollTop: newTop
    }, 1000);
  }

});
