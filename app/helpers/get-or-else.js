import Ember from 'ember';

export function getOrElse(value, alt) {
  return value || alt;
}

export default Ember.Helper.helper(function(params/*, hash*/) {
  return getOrElse.apply(this, params);
});
