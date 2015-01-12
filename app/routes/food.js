import SectionRoute from 'yoshinom/routes/section';

export default SectionRoute.extend({

  titleToken: 'Food',

  sheetNumber: 1,

  sorts: ['ratings.food', 'ratings.service', 'ratings.atmosphere', 'ratings.uniqueness', 'ratings.bathroom']

});
