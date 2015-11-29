import SectionRoute from 'yoshinom/routes/section';

export default SectionRoute.extend({

  titleToken: 'Cocktails',

  descriptionForQuery(q) {
    const preamble = 'Wouldn\'t you rather be drinking these?';
    return q ? `${preamble} Cocktail recipes featuring ${q}` : preamble;
  },

  sorts: []

});
