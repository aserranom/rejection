import { isToday } from '../../utils/dates';
import { generateId } from '../../utils/idGenerator';

export const STATUSES = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  UNANSWERED: 'UNANSWERED',
};

const STATE_KEY = 'QUESTIONS';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

const SCORES = {
  [ACCEPTED]: 1,
  [REJECTED]: 10,
  [UNANSWERED]: 0,
};

export const createState = (questions = []) => ({
  questions: [...questions],
});

export const reducer = (
  state = createState(),
  { type = '', payload = {} } = {}
) => {
  switch (type) {
    case addQuestion().type:
      return { ...state, questions: [...state.questions, payload] };
    case answerQuestion().type:
      return {
        ...state,
        questions: state.questions.map((question) =>
          question.status === UNANSWERED && question.id === payload.id
            ? {
                ...question,
                status: payload.status,
                timestamp: payload.timestamp,
              }
            : question
        ),
      };
    case editQuestion().type: {
      const { id, ...updatedFields } = payload;
      return {
        ...state,
        questions: state.questions.map((question) =>
          question.id === id
            ? {
                ...question,
                ...updatedFields,
              }
            : question
        ),
      };
    }
    default:
      return state;
  }
};

export const addQuestion = ({
  id = generateId(),
  question = '',
  askee = '',
  status = UNANSWERED,
  timestamp = status === UNANSWERED || !Object.keys(STATUSES).includes(status)
    ? undefined
    : Date.now(),
} = {}) => ({
  type: 'questions/addQuestion',
  payload: {
    id,
    timestamp,
    question,
    askee,
    status: Object.keys(STATUSES).includes(status) ? status : UNANSWERED,
  },
});

export const answerQuestion = ({
  id = '',
  status = UNANSWERED,
  timestamp = status === UNANSWERED ? undefined : Date.now(),
} = {}) => ({
  type: 'questions/answerQuestion',
  payload: {
    id,
    status,
    timestamp,
  },
});

export const editQuestion = (question = {}) => ({
  type: 'questions/editQuestion',
  payload: {
    ...question,
    ...(question.status
      ? { timestamp: question.status === UNANSWERED ? undefined : Date.now() }
      : {}),
  },
});

export const getSingleScore = ({ status }) => SCORES[status];

export const getTotalScore = (state) =>
  getQuestions(state).reduce(
    (score, question) => score + getSingleScore(question),
    0
  );

export const getTodayScore = (state) =>
  getQuestions(state).reduce(
    (score, question) =>
      score + (isToday(question.timestamp) ? getSingleScore(question) : 0),
    0
  );

export const localStorageToState = () => {
  const questions =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem(STATE_KEY));
  return createState(Array.isArray(questions) ? questions : []);
};

export const stateToLocalStorage = (state) =>
  localStorage.setItem(STATE_KEY, JSON.stringify(getQuestions(state)));

export const sortQuestions = (state) =>
  [...getQuestions(state)].sort(
    ({ timestamp: a = Infinity }, { timestamp: b = Infinity }) => b - a
  );

export const getQuestions = ({ questions }) => questions;

export const getQuestion = ({ state, id }) =>
  getQuestions(state).find((question) => question.id === id);
