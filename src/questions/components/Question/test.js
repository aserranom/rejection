import { describe } from 'riteway';
import render from 'riteway/render-component';
import match from 'riteway/match';

import { generateId } from '../../../utils/idGenerator';
import { STATUSES } from '../../reducer/reducer';
import { Question } from './Question';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

const createQuestion = (question) => render(<Question question={question} />);

describe('Question component', async (assert) => {
  {
    const now = Date.now();
    const formattedDate = new Date(now).toLocaleDateString();
    const acceptedQuestion = {
      id: generateId(),
      question: 'This is a test question',
      askee: 'This is a test askee',
      status: ACCEPTED,
      timestamp: now,
    };
    const $ = createQuestion(acceptedQuestion);
    assert({
      given: 'an accepted question',
      should: 'render a question card',
      actual: $('.card').length,
      expected: 1,
    });
    const contains = match($('.card').html());
    assert({
      given: 'an accepted question',
      should: 'render the question',
      actual: contains(acceptedQuestion.question),
      expected: acceptedQuestion.question,
    });
    assert({
      given: 'an accepted question',
      should: 'render the askee',
      actual: contains(acceptedQuestion.askee),
      expected: acceptedQuestion.askee,
    });
    assert({
      given: 'an accepted question',
      should: 'render the status',
      actual: contains(acceptedQuestion.status),
      expected: acceptedQuestion.status,
    });
    assert({
      given: 'an accepted question',
      should: 'render the formatted date',
      actual: contains(formattedDate),
      expected: formattedDate,
    });
    assert({
      given: 'an accepted question',
      should: 'render the score of 1',
      actual: parseInt($('.score').html().trim(), 10),
      expected: 1,
    });
  }
  {
    const rejectedQuestion = {
      id: generateId(),
      question: 'This is a test question',
      askee: 'This is a test askee',
      status: REJECTED,
      timestamp: Date.now(),
    };
    const $ = createQuestion(rejectedQuestion);
    const contains = match($('.card').html());
    assert({
      given: 'a rejected question',
      should: 'render the score of 10',
      actual: parseInt($('.score').html().trim(), 10),
      expected: 10,
    });
    assert({
      given: 'a rejected question',
      should: 'render the status',
      actual: contains(rejectedQuestion.status),
      expected: rejectedQuestion.status,
    });
  }
  {
    const unansweredQuestion = {
      id: generateId(),
      question: 'This is a test question',
      askee: 'This is a test askee',
      status: UNANSWERED,
    };
    const $ = createQuestion(unansweredQuestion);
    const contains = match($('.card').html());
    assert({
      given: 'an unanswered question',
      should: 'do not render score',
      actual: $('.score').length,
      expected: 0,
    });
    assert({
      given: 'an unanswered question',
      should: 'render answer buttons',
      actual: $('.answerButtons button').length,
      expected: 2,
    });
    assert({
      given: 'an unanswered question',
      should: 'render the status',
      actual: contains(unansweredQuestion.status),
      expected: unansweredQuestion.status,
    });
    assert({
      given: 'an unanswered question',
      should: 'render TBD instead of date',
      actual: contains('TBD'),
      expected: 'TBD',
    });
  }
});
