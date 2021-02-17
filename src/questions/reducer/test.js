import { describe } from 'riteway';

import { generateId } from '../../utils/idGenerator';
import {
  addQuestion,
  answerQuestion,
  createState,
  editQuestion,
  getQuestion,
  getQuestions,
  getTodayScore,
  getTotalScore,
  reducer,
  sortQuestions,
  STATUSES,
} from './reducer';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

export const getQuestionInput = ({
  id = generateId(),
  question = 'This is a test question',
  askee = 'This is a test askee',
  status = UNANSWERED,
  timestamp,
} = {}) => ({
  id,
  question,
  askee,
  status,
  timestamp,
});

const booleanizeProps = (props = []) => (obj = {}) =>
  props.reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: !!acc[prop],
    }),
    obj
  );

const idTimestampBooleanizer = booleanizeProps(['timestamp', 'id']);
const booleanizeState = (state) => ({
  ...state,
  questions: getQuestions(state).map(idTimestampBooleanizer),
});

describe('question reducer: addQuestion()', async (assert) => {
  assert({
    given: 'no args',
    should: 'initialize the state',
    actual: reducer(),
    expected: createState(),
  });
  {
    const acceptedQuestionInput = getQuestionInput({
      status: ACCEPTED,
    });

    const state = reducer(reducer(), addQuestion(acceptedQuestionInput));

    assert({
      given: 'an accepted question input',
      should: 'add an accepted question to the state',
      actual: booleanizeState(state),
      expected: createState([
        { ...acceptedQuestionInput, id: true, timestamp: true },
      ]),
    });
  }
  {
    const unansweredQuestionInput = getQuestionInput({
      status: UNANSWERED,
    });
    const rejectedQuestionInput = getQuestionInput({
      status: REJECTED,
    });
    const actions = [
      addQuestion(unansweredQuestionInput),
      addQuestion(rejectedQuestionInput),
    ];

    const state = actions.reduce(reducer, reducer());

    assert({
      given: 'adding an unanswered and rejected question',
      should: 'have a state with an unanswered and rejected question',
      actual: booleanizeState(state),
      expected: createState([
        { ...unansweredQuestionInput, id: true, timestamp: false },
        { ...rejectedQuestionInput, id: true, timestamp: true },
      ]),
    });
  }
  {
    const invalidQuestionInput = getQuestionInput({
      status: 'Fake Status',
    });

    const state = reducer(reducer(), addQuestion(invalidQuestionInput));

    assert({
      given: 'an invalid status',
      should: 'assign an unanswered status',
      actual: booleanizeState(state),
      expected: createState([
        {
          ...invalidQuestionInput,
          id: true,
          status: UNANSWERED,
          timestamp: false,
        },
      ]),
    });
  }
});

describe('question reducer: answerQuestion()', async (assert) => {
  {
    const unansweredQuestionsInputs = [
      getQuestionInput({
        id: 1,
        status: UNANSWERED,
        question: 'Test Question 1',
      }),
      getQuestionInput({
        id: 2,
        status: UNANSWERED,
        question: 'Test Question 2',
      }),
      getQuestionInput({
        id: 3,
        status: UNANSWERED,
        question: 'Test Question 1',
      }),
    ];
    const prevActions = unansweredQuestionsInputs.map(addQuestion);
    const prevState = prevActions.reduce(reducer, reducer());
    const [
      { id: idToDoNothing },
      { id: idToAccept },
      { id: idToReject },
    ] = getQuestions(prevState);
    const actions = [
      answerQuestion({ id: idToDoNothing }),
      answerQuestion({ id: idToAccept, status: ACCEPTED }),
      answerQuestion({ id: idToReject, status: REJECTED }),
    ];

    const state = actions.reduce(reducer, prevState);

    assert({
      given: 'answering an unanswered question w/o a status',
      should: 'do nothing',
      actual: getQuestion({ state, id: idToDoNothing }),
      expected: { ...unansweredQuestionsInputs[0] },
    });
    assert({
      given: 'accepting an unanswered question',
      should: 'status is accepted',
      actual: idTimestampBooleanizer(getQuestion({ state, id: idToAccept })),
      expected: {
        ...unansweredQuestionsInputs[1],
        status: ACCEPTED,
        id: true,
        timestamp: true,
      },
    });
    assert({
      given: 'rejecting an unanswered question',
      should: 'status is rejected',
      actual: idTimestampBooleanizer(getQuestion({ state, id: idToReject })),
      expected: {
        ...unansweredQuestionsInputs[2],
        status: REJECTED,
        id: true,
        timestamp: true,
      },
    });
  }
  {
    const acceptedQuestionInput = getQuestionInput({
      status: ACCEPTED,
    });
    const prevState = reducer(reducer(), addQuestion(acceptedQuestionInput));

    const state = reducer(
      prevState,
      answerQuestion({ id: acceptedQuestionInput.id, status: REJECTED })
    );

    assert({
      given: 'trying to answer an answered question',
      should: 'do nothing',
      actual: state,
      expected: prevState,
    });
  }
});

describe('question reducer selector: getQuestions()', async (assert) => {
  const acceptedQuestionInput = getQuestionInput({ status: ACCEPTED });
  const unansweredQuestionInput = getQuestionInput({ status: UNANSWERED });
  const rejectedQuestionInput = getQuestionInput({
    status: REJECTED,
  });
  const actions = [
    addQuestion(acceptedQuestionInput),
    addQuestion(unansweredQuestionInput),
    addQuestion(rejectedQuestionInput),
  ];

  const state = actions.reduce(reducer, reducer());

  assert({
    given: 'no arguments',
    should: 'return the questions in the state',
    actual: getQuestions(state),
    expected: state.questions,
  });
});

describe('question reducer selector: getQuestion()', async (assert) => {
  const acceptedQuestionInput = getQuestionInput({ status: ACCEPTED });
  const unansweredQuestionInput = getQuestionInput({ status: UNANSWERED });
  const rejectedQuestionInput = getQuestionInput({
    status: REJECTED,
  });
  const actions = [
    addQuestion(acceptedQuestionInput),
    addQuestion(unansweredQuestionInput),
    addQuestion(rejectedQuestionInput),
  ];

  const state = actions.reduce(reducer, reducer());

  assert({
    given: 'selecting a question from the state',
    should: 'return the selected question',
    actual: getQuestion({ id: rejectedQuestionInput.id, state }),
    expected: getQuestions(state)[2],
  });
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
    const acceptedQuestionInput = getQuestionInput({
      status: ACCEPTED,
      timestamp: Date.now(),
    });
    const unansweredQuestionInput = getQuestionInput({
      status: UNANSWERED,
    });
    const rejectedQuestionInput = getQuestionInput({
      status: REJECTED,
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
    });
    const actions = [
      addQuestion(acceptedQuestionInput),
      addQuestion(unansweredQuestionInput),
      addQuestion(rejectedQuestionInput),
    ];

    const state = actions.reduce(reducer, reducer());

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
    const acceptedQuestionInput = getQuestionInput({
      status: ACCEPTED,
      timestamp: Date.now(),
    });
    const unansweredQuestionInput = getQuestionInput({
      status: UNANSWERED,
    });
    const rejectedQuestionInput = getQuestionInput({
      status: REJECTED,
      timestamp: Date.now(),
    });
    const actions = [
      addQuestion(acceptedQuestionInput),
      addQuestion(unansweredQuestionInput),
      addQuestion(unansweredQuestionInput),
      addQuestion({ ...rejectedQuestionInput, timestamp: Date.now() + 1 }),
    ];
    const state = actions.reduce(reducer, reducer());

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

describe('question reducer: editQuestion()', async (assert) => {
  {
    // Arrange
    const acceptedQuestionInput = getQuestionInput({
      status: ACCEPTED,
    });
    const prevState = reducer(reducer(), addQuestion(acceptedQuestionInput));
    const updatedQuestion = {
      question: 'Updated question',
      askee: 'Updated askee',
      status: REJECTED,
    };
    // Act
    const state = reducer(
      prevState,
      editQuestion({ id: acceptedQuestionInput.id, ...updatedQuestion })
    );
    // Assert
    assert({
      given: 'updated question, askee and status',
      should: 'update the saved question',
      actual: booleanizeState(state),
      expected: createState([
        { ...updatedQuestion, id: true, timestamp: true },
      ]),
    });
  }
  {
    // Arrange
    const acceptedQuestionInput = getQuestionInput({
      status: REJECTED,
    });
    const prevState = reducer(reducer(), addQuestion(acceptedQuestionInput));
    const updatedQuestion = {
      question: 'Updated question',
      askee: 'Updated askee',
    };
    // Act
    const state = reducer(
      prevState,
      editQuestion({ id: acceptedQuestionInput.id, ...updatedQuestion })
    );
    // Assert
    assert({
      given: 'updated question and askee',
      should: 'only update question and askee',
      actual: booleanizeState(state),
      expected: createState([
        {
          ...acceptedQuestionInput,
          ...updatedQuestion,
          id: true,
          timestamp: true,
          status: REJECTED,
        },
      ]),
    });
  }
  {
    // Arrange
    const acceptedQuestionInput = getQuestionInput({
      status: UNANSWERED,
    });
    const prevState = reducer(reducer(), addQuestion(acceptedQuestionInput));
    const updatedQuestion = {
      status: ACCEPTED,
    };
    // Act
    const state = reducer(
      prevState,
      editQuestion({ id: acceptedQuestionInput.id, ...updatedQuestion })
    );
    // Assert
    assert({
      given: 'updated question and askee',
      should: 'only update question and askee',
      actual: booleanizeState(state),
      expected: createState([
        {
          ...acceptedQuestionInput,
          id: true,
          timestamp: true,
          status: ACCEPTED,
        },
      ]),
    });
  }
});
