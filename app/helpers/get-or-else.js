import Ember from 'ember';

export function getOrElse(value, alt) {
  return value || alt;
}

export default Ember.Handlebars.makeBoundHelper(getOrElse);
