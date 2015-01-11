import Ember from 'ember';

export default Ember.View.extend({

  tagName: '',
  isVirtual: true,

  scrollToDirectLink: function() {
    var name = this.get('controller.directLinkToName');
    var areImagesBeforeThisOneLoaded = this.get('areImagesBeforeThisOneLoaded');
    var $scrollTo;

    if (!name || !areImagesBeforeThisOneLoaded) {
      return;
    }

    this.set('controller.directLinkToName', '');

    $scrollTo = this._venueWithName(name);
    Ember.run.scheduleOnce('afterRender', this, '_scrollTo', $scrollTo);
  }.observes(
    'controller.directLinkToName',
    'areImagesBeforeThisOneLoaded'
  )
  .on('didInsertElement'),

  areImagesBeforeThisOneLoaded: function() {
    var name = this.get('controller.directLinkToName');
    var $scrollTo;
    var i;

    if (!name) {
      return false;
    }

    $scrollTo = this._venueWithName(name);
    i = Ember.$('.venue').index($scrollTo);
    if (i < 0) {
      return false;
    }

    return this.get('controller.content').slice(0, i)
    .everyBy('isImageLoaded');
  }.property('controller.directLinkToName', 'controller.content.@each.isImageLoaded'),

  _venueWithName: function(name) {
    return Ember.$('.venue .name:contains(' + name + ')').closest('.venue');
  },

  _scrollTo: function($element) {
    var buffer = 32;
    var newTop = $element.offset().top - buffer;
    Ember.$('html, body').animate({
      scrollTop: newTop
    }, 1000);
  }

});
