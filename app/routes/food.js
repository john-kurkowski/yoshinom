import SectionRoute from 'yoshinom/routes/section';

export default SectionRoute.extend({

  titleToken: 'Food',

  descriptionForQuery: function(q) {
    return q ? `Wouldn't you rather be eating these? Photos & reviews for restaurants located in ${q}` : 'Restaurant reviews';
  },

  sorts: ['ratings.food', 'ratings.service', 'ratings.atmosphere', 'ratings.uniqueness', 'ratings.bathroom']

});
