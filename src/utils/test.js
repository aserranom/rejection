import { describe, Try } from 'riteway';

import { throwError } from './throwError';
import { isToday, startOfDay } from './dates';

describe('throwError()', async (assert) => {
  assert({
    given: 'a message',
    should: 'throw an error with such message',
    actual: Try(throwError, 'Error message').toString(),
    expected: 'Error: Error message',
  });
});

describe('isToday()', async (assert) => {
  assert({
    given: 'a date within the day',
    should: 'return true',
    actual: isToday(new Date()),
    expected: true,
  });
  assert({
    given: "yesterday's date",
    should: 'return false',
    actual: isToday(new Date(Date.now() - 24 * 60 * 60 * 1000)),
    expected: false,
  });
  assert({
    given: "tomorrow's date",
    should: 'return false',
    actual: isToday(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    expected: false,
  });
});

describe('startOfDay()', async (assert) => {
  assert({
    given: 'a date',
    should: 'return the beginning of that day',
    actual: startOfDay(new Date(2020, 11, 1, 14, 30, 1, 50)),
    expected: new Date(2020, 11, 1),
  });
  {
    const now = new Date();

    assert({
      given: 'no arguments',
      should: 'return the beginning of today',
      actual: startOfDay(),
      expected: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    });
  }
});
