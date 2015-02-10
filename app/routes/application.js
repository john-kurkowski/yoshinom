import Ember from 'ember';


function updateMetaDescriptions(description, imageUrls) {
  const titleMeta = Ember.$('<meta property="og:title">')
  .add('<meta property="twitter:title">')
  .attr('content', document.title);

  const descriptionMeta = Ember.$('<meta property="description">')
  .add('<meta property="og:description">')
  .add('<meta property="twitter:description">')
  .attr('content', description);

  const defaultImageUrls = ['/logo.png'];
  const imageMetas = (imageUrls || defaultImageUrls).map(function(imageUrl) {
    return Ember.$(`<meta property="og:image">`)
    .add('<meta property="og:image:url">')
    .add('<meta property="twitter:image:src">')
    .attr('content', imageUrl);
  });

  const head = Ember.$('head');
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
  .map(function(prop) { return `meta[property="${prop}"]`; })
  .join(', ');
  head.find(tagsToRemove).remove();

  head
  .append(titleMeta)
  .append(descriptionMeta)
  .append(imageMetas);
}

export default Ember.Route.extend({

  title: function(tokens) {
    tokens.reverse();
    tokens.push('Yoshinom');
    return tokens.join(' | ');
  },

  actions: {

    updateMetaDescription: function(description, imageUrls) {
      Ember.run.scheduleOnce('afterRender', null, updateMetaDescriptions, description, imageUrls);
    },

  }

});
