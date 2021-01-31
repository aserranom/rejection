import { describe, Try } from 'riteway';

import {
  addQuestion,
  answerQuestion,
  getTodayScore,
  getTotalScore,
  reducer,
  sortQuestions,
  STATUSES,
} from '../reducer';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

export const getQuestionInput = ({
  question = 'This is a test question',
  askee = 'This is a test askee',
  status = UNANSWERED,
} = {}) => ({
  question,
  askee,
  status,
});

const propsOmitter = (...props) => (obj) =>
  props.reduce((acc, prop) => {
    // eslint-disable-next-line no-unused-vars
    const { [prop]: omittedProp, ...rest } = acc;
    return rest;
  }, obj);

const idTimestampOmitter = propsOmitter('id', 'timestamp');

describe('question reducer: addQuestion()', async (assert) => {
  assert({
    given: 'no args',
    should: 'initialize the state with an empty array',
    actual: reducer(),
    expected: [],
  });
  {
    const acceptedQuestionInput = getQuestionInput({ status: ACCEPTED });
    const action = addQuestion(acceptedQuestionInput);
    const state = reducer(reducer(), action);
    assert({
      given: 'an accepted question input',
      should: 'add an accepted question to the state',
      actual: state.map(idTimestampOmitter),
      expected: [acceptedQuestionInput],
    });
    assert({
      given: 'an accepted question input',
      should: 'add an accepted question with id and timestamp to the state',
      actual: state.every(
        ({ id, timestamp }) =>
          typeof id === 'string' && typeof timestamp === 'number'
      ),
      expected: true,
    });
  }
  {
    const unansweredQuestionInput = getQuestionInput({ status: UNANSWERED });
    const rejectedQuestionInput = getQuestionInput({ status: REJECTED });
    const actions = [
      addQuestion(unansweredQuestionInput),
      addQuestion(rejectedQuestionInput),
    ];
    const state = actions.reduce(reducer, reducer());
    assert({
      given: 'adding an unanswered and rejected question',
      should: 'have a state with an unanswered and rejected question',
      actual: state.map(idTimestampOmitter),
      expected: [unansweredQuestionInput, rejectedQuestionInput],
    });
    assert({
      given: 'adding an unanswered and rejected question',
      should:
        'have a state with an unanswered question with id but no timestamp',
      actual:
        typeof state[0].id === 'string' &&
        typeof state[0].timestamp === 'undefined',
      expected: true,
    });
    assert({
      given: 'adding an unanswered and rejected question',
      should: 'have a state with a rejected question with id and timestamp',
      actual:
        typeof state[1].id === 'string' &&
        typeof state[1].timestamp === 'number',
      expected: true,
    });
  }
  {
    const invalidQuestionInput = getQuestionInput({ status: 'Fake Status' });
    assert({
      given: 'an invalid status',
      should: 'throw "Error: Invalid Status"',
      actual: Try(addQuestion, invalidQuestionInput).toString(),
      expected: 'Error: Invalid Status',
    });
  }
});

describe('question reducer: answerQuestion()', async (assert) => {
  {
    const unansweredQuestionsInputs = [
      getQuestionInput({
        status: UNANSWERED,
        question: 'Test Question 1',
      }),
      getQuestionInput({
        status: UNANSWERED,
        question: 'Test Question 2',
      }),
      getQuestionInput({
        status: UNANSWERED,
        question: 'Test Question 1',
      }),
    ];
    const prevActions = unansweredQuestionsInputs.map((input) =>
      addQuestion(input)
    );
    const prevState = prevActions.reduce(reducer, reducer());
    const [
      { id: idToDoNothing },
      { id: idToAccept },
      { id: idToReject },
    ] = prevState;
    const actions = [
      answerQuestion({ id: idToDoNothing }),
      answerQuestion({ id: idToAccept, status: ACCEPTED }),
      answerQuestion({ id: idToReject, status: REJECTED }),
    ];
    const state = actions.reduce(reducer, prevState);
    assert({
      given: 'answering an unanswered question w/o a status',
      should: 'do nothing',
      actual: idTimestampOmitter(state[0]),
      expected: unansweredQuestionsInputs[0],
    });
    assert({
      given: 'accepting an unanswered question',
      should: 'status is accepted',
      actual: idTimestampOmitter(state[1]),
      expected: { ...unansweredQuestionsInputs[1], status: ACCEPTED },
    });
    assert({
      given: 'accepting an unanswered question',
      should: 'has timestamp',
      actual:
        typeof state[1].id === 'string' &&
        typeof state[1].timestamp === 'number',
      expected: true,
    });
    assert({
      given: 'rejecting an unanswered question',
      should: 'status is rejected',
      actual: idTimestampOmitter(state[2]),
      expected: { ...unansweredQuestionsInputs[2], status: REJECTED },
    });
    assert({
      given: 'rejecting an unanswered question',
      should: 'has timestamp',
      actual:
        typeof state[2].id === 'string' &&
        typeof state[2].timestamp === 'number',
      expected: true,
    });
  }
  {
    /*
        TOASK: what if we wanted to throw an error? Shouldn't we do it inside the action creator,
        since throwing is a side-effect? But in that case we would need the current state;
        passing such state everywhere we need to call the action creator seems a bit tedious
        and would force us to have the current state at hand.
      */
    const acceptedQuestionInput = getQuestionInput({ status: ACCEPTED });
    const prevState = reducer(reducer(), addQuestion(acceptedQuestionInput));
    const [{ id }] = prevState;
    assert({
      given: 'trying to answer an answered question',
      should: 'do nothing',
      actual: reducer(prevState, answerQuestion({ id, status: REJECTED })),
      expected: prevState,
    });
  }
});

describe('question reducer selector: getTotalScore()', async (assert) => {
  {
    const acceptedQuestionInput = getQuestionInput({ status: ACCEPTED });
    const unansweredQuestionInput = getQuestionInput({ status: UNANSWERED });
    const rejectedQuestionInput = getQuestionInput({ status: REJECTED });
    const actions = [
      addQuestion(acceptedQuestionInput),
      addQuestion(unansweredQuestionInput),
      addQuestion(rejectedQuestionInput),
    ];
    const state = actions.reduce(reducer, reducer());
    assert({
      given: 'an accepted, rejected and unanswered question',
      should: 'return a total score of 11',
      actual: getTotalScore(state),
      expected: 11,
    });
  }
});

describe('question reducer selector: getTodayScore', async (assert) => {
  {
    const acceptedQuestionInput = getQuestionInput({ status: ACCEPTED });
    const unansweredQuestionInput = getQuestionInput({ status: UNANSWERED });
    const rejectedQuestionInput = getQuestionInput({ status: REJECTED });
    const actions = [
      addQuestion(acceptedQuestionInput),
      addQuestion(unansweredQuestionInput),
      addQuestion(rejectedQuestionInput),
    ];
    const state = actions.reduce(reducer, reducer());
    // TOASK: Is it legal to do this? I assume it is not since state is immutable
    // So how should we manage these cases.
    state[2].timestamp = Date.now() - 24 * 60 * 60 * 1000;
    assert({
      given: 'an accepted, rejected (from yesterday) and unanswered question',
      should: 'return a total daily score of 1',
      actual: getTodayScore(state),
      expected: 1,
    });
  }
});

describe('question reducer selector: sortQuestions', async (assert) => {
  {
    const acceptedQuestionInput = getQuestionInput({ status: ACCEPTED });
    const unansweredQuestionInput = getQuestionInput({ status: UNANSWERED });
    const rejectedQuestionInput = getQuestionInput({ status: REJECTED });
    const actions = [
      addQuestion(acceptedQuestionInput),
      addQuestion(unansweredQuestionInput),
      addQuestion(unansweredQuestionInput),
    ];
    const prevState = actions.reduce(reducer, reducer());
    await new Promise((resolve) => setTimeout(() => resolve(), 1));
    const state = reducer(prevState, addQuestion(rejectedQuestionInput));
    const sortedQuestions = sortQuestions(state);
    assert({
      given:
        'an unsorted array of questions [accepted, unanswered, unanswered, rejected]',
      should: 'put unanswered questions first',
      actual:
        sortedQuestions[0].status === UNANSWERED &&
        sortedQuestions[1].status === UNANSWERED,
      expected: true,
    });
    assert({
      given:
        'an unsorted array of questions [accepted, unanswered, unanswered, rejected]',
      should: 'put the first question last',
      actual: sortedQuestions[sortedQuestions.length - 1].status === ACCEPTED,
      expected: true,
    });
  }
});
