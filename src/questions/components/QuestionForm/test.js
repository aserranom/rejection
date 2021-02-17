import { describe } from 'riteway';
import render from 'riteway/render-component';

import { QuestionForm } from './QuestionForm';

describe('QuestionForm component', async (assert) => {
  {
    const $ = render(<QuestionForm />);

    assert({
      given: 'no arguments',
      should: 'show a question input',
      actual: $('input[name="question"]').length,
      expected: 1,
    });
    assert({
      given: 'no arguments',
      should: 'show an askee input',
      actual: $('input[name="askee"]').length,
      expected: 1,
    });
    assert({
      given: 'no arguments',
      should: 'show an accepted question button',
      actual: $('button[title="ACCEPTED"]').length,
      expected: 1,
    });
    assert({
      given: 'no arguments',
      should: 'show a rejected question button',
      actual: $('button[title="REJECTED"]').length,
      expected: 1,
    });
    assert({
      given: 'no arguments',
      should: 'show an unanswered question button',
      actual: $('button[title="UNANSWERED"]').length,
      expected: 1,
    });
  }
});
