import { isToday } from '../../utils/dates';
import { generateId } from '../../utils/idGenerator';
import { throwError } from '../../utils/throwError';

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

export const reducer = (state = [], { type = '', payload = {} } = {}) => {
  switch (type) {
    case addQuestion().type:
      return [...state, payload];
    case answerQuestion().type:
      return state.map((question) =>
        question.status === UNANSWERED && question.id === payload.id
          ? {
              ...question,
              status: payload.status,
              timestamp: payload.timestamp,
            }
          : question
      );
    default:
      return state;
  }
};

export const addQuestion = ({
  question = '',
  askee = '',
  status = UNANSWERED,
} = {}) =>
  Object.keys(STATUSES).includes(status)
    ? {
        type: 'ADD_QUESTION',
        payload: {
          id: generateId(),
          timestamp: status === UNANSWERED ? undefined : Date.now(),
          question,
          askee,
          status,
        },
      }
    : throwError('Invalid Status');

export const answerQuestion = ({ id = '', status = UNANSWERED } = {}) => ({
  type: 'ANSWER_QUESTION',
  payload: {
    id,
    status,
    timestamp: status === UNANSWERED ? undefined : Date.now(),
  },
});

export const getSingleScore = ({ status }) => SCORES[status];

export const getTotalScore = (state) =>
  state.reduce((score, question) => score + getSingleScore(question), 0);

export const getTodayScore = (state) =>
  state.reduce(
    (score, question) =>
      score + (isToday(question.timestamp) ? getSingleScore(question) : 0),
    0
  );

export const localStorageToState = () =>
  (typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem(STATE_KEY))) ||
  [];

export const stateToLocalStorage = (state) =>
  localStorage.setItem(STATE_KEY, JSON.stringify(state));

export const sortQuestions = (questions) =>
  [...questions].sort(
    ({ timestamp: a = Infinity }, { timestamp: b = Infinity }) => b - a
  );
