import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
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
