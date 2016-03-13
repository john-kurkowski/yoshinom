import Ember from 'ember';

const { Component, observer, on, run, $ } = Ember;

import config from 'yoshinom/config/environment';

const SCROLL_DURATION = config.environment === 'test' ? 0 : 1200;

/*
  Scroll the app in either production or test.
*/
const SCROLL_TARGET = '#ember-testing-container, .ember-application';

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
    $(SCROLL_TARGET).animate({
      scrollTop: newTop
    }, {
      duration: SCROLL_DURATION,
      easing: 'easeInOutQuint'
    });

    $element.find('.card').focus();
  }

});
