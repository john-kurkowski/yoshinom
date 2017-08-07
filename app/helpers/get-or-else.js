import Helper from 'ember-helper';

export function getOrElse(value, alt) {
  return value || alt;
}

export default Helper.helper(function(params /* , hash*/) {
  return getOrElse.apply(this, params);
});
