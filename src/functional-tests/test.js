import { ClientFunction, Selector } from 'testcafe';

import { STATUSES } from '../questions/reducer/reducer';
import { getQuestionInput } from '../questions/reducer/__tests__/test';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

const addQuestion = ({ t, question, askee, status }) =>
  t
    .typeText('[name=question]', question)
    .typeText('[name=askee]', askee)
    .click(`[title=${status}]`);

fixture`Rejection App: Page Tests`.page('localhost:3000');

test('Page should load and display the correct title', async (t) => {
  const actual = Selector('h1').innerText;
  const expected = 'The Rejection App';
  await t.expect(actual).eql(expected);
});

fixture`Rejection App: Question Form Tests`.page('localhost:3000');

test('As a User I can add Questions', async (t) => {
  const acceptedQuestionInput = getQuestionInput({ status: ACCEPTED });
  const rejectedQuestionInput = getQuestionInput({ status: REJECTED });
  await addQuestion({
    ...acceptedQuestionInput,
    t,
  });
  await addQuestion({
    ...rejectedQuestionInput,
    t,
  });
  const questionsSelector = Selector('[class^=Questions_questionsWrapper]');
  const acceptedQuestionSelector = questionsSelector.find(
    '[class^=Question_card]:last-child'
  );
  const rejectedQuestionSelector = questionsSelector.find(
    '[class^=Question_card]:first-child'
  );
  const actual = {
    accepted: {
      question: acceptedQuestionSelector.find('[class^=Question_question]')
        .innerText,
      askee: acceptedQuestionSelector.find('[class^=Question_details]')
        .innerText,
      status: acceptedQuestionSelector.find('[class^=Question_scoreStatus]')
        .innerText,
    },
    rejected: {
      question: rejectedQuestionSelector.find('[class^=Question_question]')
        .innerText,
      askee: rejectedQuestionSelector.find('[class^=Question_details]')
        .innerText,
      status: rejectedQuestionSelector.find('[class^=Question_scoreStatus]')
        .innerText,
    },
  };
  const expected = {
    accepted: acceptedQuestionInput,
    rejected: rejectedQuestionInput,
  };
  await t
    .expect(actual.accepted.question)
    .eql(expected.accepted.question)
    .expect(actual.accepted.askee)
    .contains(expected.accepted.askee)
    .expect(actual.accepted.status)
    .eql(expected.accepted.status)
    .expect(actual.rejected.question)
    .eql(expected.rejected.question)
    .expect(actual.rejected.askee)
    .contains(expected.rejected.askee)
    .expect(actual.rejected.status)
    .eql(expected.rejected.status);
});

fixture`Rejection App: Question Answer Tests`.page('localhost:3000');

test('As a User I can answer an unanswered Question', async (t) => {
  const questionInput = getQuestionInput({ status: UNANSWERED });
  await addQuestion({
    ...questionInput,
    t,
  });
  await t.click('[class^=Question_answerButtons] button:last-child');
  const actual = {
    question: Selector('[class^=Question_question]').innerText,
    askee: Selector('[class^=Question_details]').innerText,
    status: Selector('[class^=Question_scoreStatus]').innerText,
  };
  const expected = { ...questionInput, status: REJECTED };
  await t
    .expect(actual.question)
    .eql(expected.question)
    .expect(actual.askee)
    .contains(expected.askee)
    .expect(actual.status)
    .eql(expected.status);
});

fixture`Rejection App: Local Storage Tests`.page('localhost:3000');

test('As a User added questions persist through navigation', async (t) => {
  const questionInput = getQuestionInput({ status: ACCEPTED });
  await addQuestion({
    ...questionInput,
    t,
  });
  const reload = ClientFunction(() => location.reload());
  await reload();
  const actual = {
    question: Selector('[class^=Question_question]').innerText,
    askee: Selector('[class^=Question_details]').innerText,
    status: Selector('[class^=Question_scoreStatus]').innerText,
  };
  const expected = questionInput;
  await t
    .expect(actual.question)
    .eql(expected.question)
    .expect(actual.askee)
    .contains(expected.askee)
    .expect(actual.status)
    .eql(expected.status);
});
