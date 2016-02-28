import Ember from 'ember';

const { Controller } = Ember;

import YoshinomSectionControllerMixin from 'yoshinom/mixins/yoshinom-section-controller';

export default Controller.extend(YoshinomSectionControllerMixin, {

  s: 'ratings.food'

});
