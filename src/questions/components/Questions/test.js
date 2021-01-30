import { describe } from 'riteway';
import render from 'riteway/render-component';

import { generateId } from '../../../utils/idGenerator';
import { STATUSES } from '../../reducer/reducer';
import { Questions } from './Questions';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

const createQuestions = (questions = []) =>
  render(<Questions questions={questions} />);

describe('Questions component', async (assert) => {
  {
    const $ = createQuestions();
    assert({
      given: 'no argument',
      should: 'render an empty div',
      actual: $('.questionsWrapper').html(),
      expected: '',
    });
  }
  {
    const questions = [
      {
        id: generateId(),
        question: 'This is a test question',
        askee: 'This is a test askee',
        status: ACCEPTED,
        timestamp: Date.now(),
      },
      {
        id: generateId(),
        question: 'This is a test question',
        askee: 'This is a test askee',
        status: REJECTED,
        timestamp: Date.now(),
      },
      {
        id: generateId(),
        question: 'This is a test question',
        askee: 'This is a test askee',
        status: UNANSWERED,
      },
    ];
    const $ = createQuestions(questions);
    assert({
      given: '3 questions',
      should: 'render 3 questions',
      actual: $('.questionsWrapper > div').length,
      expected: 3,
    });
  }
});
