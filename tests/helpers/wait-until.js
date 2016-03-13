import Test from 'ember-test';

export default function waitUntil(callback) {
  function waiter() {
    const isWaitOver = callback();
    if (isWaitOver) {
      Test.unregisterWaiter(waiter);
    }
    return isWaitOver;
  }

  Test.registerWaiter(waiter);
}
