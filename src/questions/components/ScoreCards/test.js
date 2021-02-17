import { describe } from 'riteway';
import match from 'riteway/match';
import render from 'riteway/source/render-component';

import { ScoreCards } from './ScoreCards';

const createScoreCards = (props) => <ScoreCards {...props} />;

describe('ScoreCards component', async (assert) => {
  {
    const $ = render(createScoreCards());

    const containsTodayScore = match($('.todayScore').html());
    const containsTotalScore = match($('.totalScore').html());
    assert({
      given: 'no arguments',
      should: 'render a .scoreCards container',
      actual: $('.scoreCards').length,
      expected: 1,
    });
    assert({
      given: 'no arguments',
      should: 'render todayScore of 0',
      actual: containsTodayScore(0),
      expected: '0',
    });
    assert({
      given: 'no arguments',
      should: 'render totalScore of 0',
      actual: containsTotalScore(0),
      expected: '0',
    });
  }
  {
    const $ = render(createScoreCards({ totalScore: 119, todayScore: 21 }));

    const containsTodayScore = match($('.todayScore').html());
    const containsTotalScore = match($('.totalScore').html());
    assert({
      given: 'a totalScore of 119',
      should: 'render totalScore of 119',
      actual: containsTotalScore(119),
      expected: '119',
    });
    assert({
      given: 'a todayScore of 21',
      should: 'render todayScore of 21',
      actual: containsTodayScore(21),
      expected: '21',
    });
  }
});
