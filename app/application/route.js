import Route from 'ember-route';
import run from 'ember-runloop';
import $ from 'jquery';

function updateMetaDescriptions(description, imageUrls) {
  const titleMeta = $('<meta property="og:title">')
    .add('<meta name="twitter:title">')
    .attr('content', document.title);

  const descriptionMeta = $('<meta property="description">')
    .add('<meta property="og:description">')
    .add('<meta name="twitter:description">')
    .attr('content', description);

  const defaultImageUrls = ['/logo.png'];
  const imageMetas = (imageUrls || defaultImageUrls).map(function(imageUrl) {
    return $('<meta property="og:image">')
      .add('<meta property="og:image:url">')
      .add('<meta name="twitter:image:src">')
      .attr('content', imageUrl);
  });

  const head = $('head');
  const tagsToRemove = [
    'description',
    'og:description',
    'og:image',
    'og:image:url',
    'og:title',
    'twitter:description',
    'twitter:image:src',
    'twitter:title',
  ]
    .map(function(prop) {
      return `meta[name="${prop}"], meta[property="${prop}"]`;
    })
    .join(', ');
  head.find(tagsToRemove).remove();

  head
    .append(titleMeta)
    .append(descriptionMeta)
    .append(imageMetas);
}

export default Route.extend({

  title(tokens) {
    tokens.reverse();
    tokens.push('Yoshinom');
    return tokens.join(' | ');
  },

  actions: {

    updateMetaDescription(description, imageUrls) {
      run.scheduleOnce('afterRender', null, updateMetaDescriptions, description, imageUrls);
    },

  },

});
