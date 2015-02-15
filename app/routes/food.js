import SectionRoute from 'yoshinom/routes/section';

export default SectionRoute.extend({

  titleToken: 'Food',

  descriptionForQuery: function(q) {
    const preamble = 'Wouldn\'t you rather be eating these?';
    return q ? `${preamble} Photos & reviews for restaurants located in ${q}` : preamble;
  },

  sorts: ['ratings.food', 'ratings.service', 'ratings.drink', 'ratings.atmosphere', 'ratings.uniqueness', 'ratings.bathroom']

});
