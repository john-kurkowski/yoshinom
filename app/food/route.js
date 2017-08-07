import SectionRoute from 'yoshinom/yoshinom-section/route';

export default SectionRoute.extend({

  titleToken: 'Food',

  descriptionForQuery(q) {
    const preamble = 'Wouldn\'t you rather be eating these?';
    return q ? `${preamble} Photos & reviews for restaurants located in ${q}` : preamble;
  },

  sorts: ['ratings.food', 'ratings.service', 'ratings.drink', 'ratings.atmosphere', 'ratings.uniqueness', 'ratings.bathroom'],

});
