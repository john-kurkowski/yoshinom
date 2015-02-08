import Ember from 'ember';

export default Ember.View.extend({

  tagName: '',
  isVirtual: true,

  scrollToDirectLink: function() {
    const name = this.get('controller.directLinkToName');
    const areImagesBeforeThisOneLoaded = this.get('areImagesBeforeThisOneLoaded');

    if (!name || !areImagesBeforeThisOneLoaded) {
      return;
    }

    this.set('controller.directLinkToName', '');

    const $scrollTo = this._cardWithName(name);
    Ember.run.scheduleOnce('afterRender', this, '_scrollTo', $scrollTo);
  }.observes(
    'controller.directLinkToName',
    'areImagesBeforeThisOneLoaded'
  )
  .on('didInsertElement'),

  areImagesBeforeThisOneLoaded: function() {
    const name = this.get('controller.directLinkToName');

    if (!name) {
      return false;
    }

    const $scrollTo = this._cardWithName(name);
    const i = Ember.$('.card').index($scrollTo);
    if (i < 0) {
      return false;
    }

    return this.get('controller.content').slice(0, i)
    .everyBy('isImageLoaded');
  }.property('controller.directLinkToName', 'controller.content.@each.isImageLoaded'),

  _cardWithName: function(name) {
    return Ember.$(`.card .name:contains(${name})`).closest('.card');
  },

  _scrollTo: function($element) {
    const buffer = 32;
    const newTop = $element.offset().top - buffer;
    Ember.$('html, body').animate({
      scrollTop: newTop
    }, 1000);

    $element.find('.card').focus();
  }

});
