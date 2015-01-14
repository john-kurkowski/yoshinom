import _ from 'lodash';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

let FoodItemModel = YoshinomItem.extend({

  ratings: {},

  imageAlt: function() {
    return `Photo of food & drink at ${this.get('name')}`;
  }.property('name')

});

FoodItemModel.reopenClass({

  fromSpreadsheetRow: function(row) {
    const ratingsProps = ['food', 'service', 'atmosphere', 'uniqueness', 'bathroom'];
    const ratings = _.pick(row, ratingsProps);
    const newRow = _.omit(row, ratingsProps);
    newRow.ratings = ratings;

    return FoodItemModel.create(newRow);
  }

});

export default FoodItemModel;
