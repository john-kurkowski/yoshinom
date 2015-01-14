import _ from 'lodash';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

var FoodItemModel = YoshinomItem.extend({

  imageAlt: function() {
    return 'Photo of food & drink at ' + this.get('name');
  }.property('name')

});

FoodItemModel.reopenClass({

  fromSpreadsheetRow: function(row) {
    let ratingsProps = ['food', 'service', 'atmosphere', 'uniqueness', 'bathroom'];
    let ratings = _.pick(row, ratingsProps);
    let newRow = _.omit(row, ratingsProps);
    newRow.ratings = ratings;

    return FoodItemModel.create(newRow);
  }

});

export default FoodItemModel;
