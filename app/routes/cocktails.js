import SectionRoute from 'yoshinom/routes/section';

export default SectionRoute.extend({

  titleToken: 'Cocktails',

  descriptionForQuery: function(q) {
    return q ? `Wouldn't you rather be drinking these? Cocktail recipes featuring ${q}` : 'Cocktail recipes';
  },

  sorts: []

});
