import { describe } from 'riteway';
import render from 'riteway/render-component';
import match from 'riteway/match';

import { generateId } from '../../../utils/idGenerator';
import { STATUSES } from '../../reducer/reducer';
import { Question } from './Question';
import { getQuestionInput } from '../../reducer/test';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

const createQuestion = ({ question, score = 0, edit = false }) =>
  render(<Question question={question} score={score} edit={edit} />);

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

    const $ = createQuestion({ question: acceptedQuestion, score: 1 });

    const contains = match($('.card').html());
    const containsScore = match($('.rightWrapper > span').html());
    assert({
      given: 'an accepted question',
      should: 'render a question card',
      actual: $('.card').length,
      expected: 1,
    });
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
      given: 'a score of 1',
      should: 'render a score of 1',
      actual: containsScore(1),
      expected: '1',
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

    const $ = createQuestion({ question: rejectedQuestion, score: 10 });

    const contains = match($('.card').html());
    const containsScore = match($('.rightWrapper > span').html());
    assert({
      given: 'a score of 10',
      should: 'render a score of 10',
      actual: containsScore(10),
      expected: '10',
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

    const $ = createQuestion({ question: unansweredQuestion });

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
  {
    const $ = createQuestion({ question: getQuestionInput() });

    assert({
      given: 'a question in read-mode',
      should: 'have an edit button',
      actual: $('.card .editWrapper').length,
      expected: 1,
    });
  }
  {
    const questionInput = getQuestionInput();

    const $ = createQuestion({ question: questionInput, edit: true });

    const questionContains = match($('input.question').val());
    const askeeContains = match($('input[name="askee"]').val());
    const statusContains = match($('select[name="status"]').val());
    assert({
      given: 'a question in edit-mode',
      should: 'have a save button',
      actual: $('.card .editWrapper.edit').length,
      expected: 1,
    });
    assert({
      given: 'a question in edit-mode',
      should: 'have an input with the question prefilled',
      actual: questionContains(questionInput.question),
      expected: questionInput.question,
    });
    assert({
      given: 'a question in edit-mode',
      should: 'have an input with the askee prefilled',
      actual: askeeContains(questionInput.askee),
      expected: questionInput.askee,
    });
    assert({
      given: 'as question in edit-mode',
      should: 'have a status selector with the current status preselected',
      actual: statusContains(questionInput.status),
      expected: questionInput.status,
    });
  }
});
