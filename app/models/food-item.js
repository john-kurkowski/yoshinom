import Ember from 'ember';
import omit from 'lodash/object/omit';
import pick from 'lodash/object/pick';

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
    const ratings = pick(row, ratingsProps);
    const newRow = omit(row, ratingsProps);
    newRow.ratings = ratings;

    return FoodItemModel.create(newRow);
  }

});

export default FoodItemModel;
