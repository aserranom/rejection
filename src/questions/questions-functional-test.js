import { ClientFunction, Selector } from 'testcafe';

import { STATUSES } from '../questions/reducer/reducer';
import { getQuestionInput } from './reducer/test';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

const addQuestion = ({ t, question, askee, status }) =>
  t
    .typeText('[name=question]', question)
    .typeText('[name=askee]', askee)
    .click(`[title=${status}]`);

fixture`Rejection App: Page Tests`.page('localhost:3030');

test('Page should load and display the correct title', async (t) => {
  const actual = Selector('h1').innerText;
  const expected = 'The Rejection App';
  await t.expect(actual).eql(expected);
});

fixture`Rejection App: Question Form Tests`.page('localhost:3030');

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

fixture`Rejection App: Question Answer Tests`.page('localhost:3030');

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

fixture`Rejection App: Local Storage Tests`.page('localhost:3030');

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

fixture`Rejection App: Edit Question Tests`.page('localhost:3030');

// A bit difficult to apply AAA here should I split it in 2 tests?
test('As a user I can toggle edit mode', async (t) => {
  await addQuestion({
    ...getQuestionInput({ status: ACCEPTED }),
    t,
  });
  const questionCard = Selector('[class^=Question_card');
  const editButton = questionCard.find('[class^=Question_editWrapper]');

  await t.hover(questionCard).click(editButton);
  await t.expect(editButton.textContent).eql('👍');

  await t.click(editButton);
  await t.expect(editButton.textContent).eql('✏️');
});

test('As a user I can edit a question', async (t) => {
  const questionIdToUpdate = 'questionIdToUpdate';
  const newStatus = REJECTED;
  const newQuestion = 'This question has been updated';
  const newAskee = 'This askee has been updated';
  await addQuestion({
    ...getQuestionInput({
      id: questionIdToUpdate,
      status: ACCEPTED,
    }),
    t,
  });
  const questionCard = Selector('[class^=Question_card');
  const editButton = questionCard.find('[class^=Question_editWrapper]');
  const questionInput = questionCard.find('input[name=question]');
  const askeeInput = questionCard.find('input[name=askee]');
  const statusSelect = questionCard.find('select[name=status]');
  const statusSelectOption = statusSelect.find('option');

  await t.hover(questionCard).click(editButton);
  await t.selectText(questionInput).typeText(questionInput, newQuestion);
  await t.selectText(askeeInput).typeText(askeeInput, newAskee);
  await t.click(statusSelect).click(statusSelectOption.withText(newStatus));
  await t.click(editButton);

  await t
    .expect(questionCard.find('[class^=Question_question]').innerText)
    .eql(newQuestion);
  await t
    .expect(questionCard.find('[class^=Question_details]').innerText)
    .contains(newAskee);
  await t
    .expect(questionCard.find('[class^=Question_scoreStatus]').innerText)
    .eql(newStatus);
});

/*
The selector value is evaluated each time you :

use the selector for an action;
assert selector's properties;
call the selector directly in code to get it's state;
*/
