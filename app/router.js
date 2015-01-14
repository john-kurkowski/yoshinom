import Ember from 'ember';
import config from './config/environment';

let Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('food', function() {
    this.resource('food.item', { path: '/:name' });
  });

  this.resource('cocktails', function() {
    this.resource('cocktails.item', { path: '/:name' });
  });
});

export default Router;
