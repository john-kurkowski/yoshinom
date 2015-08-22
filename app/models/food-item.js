import Ember from 'ember';
import _ from 'lodash';

import YoshinomItem from 'yoshinom/models/yoshinom-item';

let FoodItemModel = YoshinomItem.extend({

  ratings: {},

  imageAlt: Ember.computed('name', function() {
    return `Photo of food & drink at ${this.get('name')}`;
  })

});

FoodItemModel.reopenClass({

  fromSpreadsheetRow(row) {
    const ratingsProps = ['food', 'drink', 'service', 'atmosphere', 'uniqueness', 'bathroom'];
    const ratings = _.pick(row, ratingsProps);
    const newRow = _.omit(row, ratingsProps);
    newRow.ratings = ratings;

    return FoodItemModel.create(newRow);
  }

});

export default FoodItemModel;
