import EmberRouter from 'ember-router';

import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('food', function() {
    this.route('item', { path: '/:name' });
  });

  this.route('cocktails', function() {
    this.route('item', { path: '/:name' });
  });
});

export default Router;
