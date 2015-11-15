import Ember from 'ember';

export default Ember.Component.extend({

  model: [],

  directLinkToName: '',

  scrollToDirectLinkOnDidInsertElement: Ember.on('didInsertElement', function() {
    Ember.run.scheduleOnce('afterRender', this, this.scrollToDirectLink);
  }),

  scrollToDirectLink: Ember.observer('directLinkToName', function() {
    const name = this.get('directLinkToName');
    if (!name) {
      return;
    }

    this.set('directLinkToName', '');

    const $scrollTo = this._cardWithName(name);
    this._scrollTo($scrollTo);
  }),

  _cardWithName(name) {
    return Ember.$(`.card .name:contains(${name})`).closest('.card');
  },

  _scrollTo($element) {
    const buffer = 32;
    const newTop = $element.offset().top - buffer;
    Ember.$('html, body').animate({
      scrollTop: newTop
    }, {
      duration: 1200,
      easing: 'easeInOutQuint'
    });

    $element.find('.card').focus();
  }

});
