import { describe } from 'riteway';
import render from 'riteway/source/render-component';

import { ScoreCards } from './ScoreCards';

const createScoreCards = (props) => <ScoreCards {...props} />;

describe('ScoreCards component', async (assert) => {
  {
    const $ = render(createScoreCards());
    assert({
      given: 'no arguments',
      should: 'render a .scoreCards container',
      actual: $('.scoreCards').length,
      expected: 1,
    });
    assert({
      given: 'no arguments',
      should: 'render todayScore of 0',
      actual: parseInt($('.todayScore').html().trim(), 10),
      expected: 0,
    });
    assert({
      given: 'no arguments',
      should: 'render totalScore of 0',
      actual: parseInt($('.totalScore').html().trim(), 10),
      expected: 0,
    });
  }
  {
    const $ = render(createScoreCards({ totalScore: 119, todayScore: 21 }));
    assert({
      given: 'a totalScore of 119',
      should: 'render totalScore of 119',
      actual: parseInt($('.totalScore').html().trim(), 10),
      expected: 119,
    });
    assert({
      given: 'a todayScore of 21',
      should: 'render todayScore of 21',
      actual: parseInt($('.todayScore').html().trim(), 10),
      expected: 21,
    });
  }
});
