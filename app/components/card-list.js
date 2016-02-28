import Ember from 'ember';

const { Component, observer, on, run, $ } = Ember;

export default Component.extend({

  model: [],

  directLinkToName: '',

  scrollToDirectLinkOnDidInsertElement: on('didInsertElement', function() {
    run.scheduleOnce('afterRender', this, this.scrollToDirectLink);
  }),

  scrollToDirectLink: observer('directLinkToName', function() {
    const name = this.get('directLinkToName');
    if (!name) {
      return;
    }

    this.set('directLinkToName', '');

    const $scrollTo = this._cardWithName(name);
    this._scrollTo($scrollTo);
  }),

  _cardWithName(name) {
    return $(`.card .name:contains(${name})`).closest('.card');
  },

  _scrollTo($element) {
    const buffer = 32;
    const newTop = $element.offset().top - buffer;
    $('html, body').animate({
      scrollTop: newTop
    }, {
      duration: 1200,
      easing: 'easeInOutQuint'
    });

    $element.find('.card').focus();
  }

});
