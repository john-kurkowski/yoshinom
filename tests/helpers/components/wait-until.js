import componentWait from 'ember-test-helpers/wait';

import generalWaitUntil from '../wait-until';

export default function waitUntil(callback) {
  generalWaitUntil(callback);

  return componentWait();
}
