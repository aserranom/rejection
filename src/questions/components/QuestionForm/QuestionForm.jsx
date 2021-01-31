import React, { useState } from 'react';
import { func } from 'prop-types';

import { STATUSES } from '../../reducer/reducer';

import * as styles from './QuestionForm.module.css';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

export const QuestionForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [askee, setAskee] = useState('');
  const resetForm = () => {
    setQuestion('');
    setAskee('');
  };
  const handleSubmit = (status) => {
    onSubmit({ question, askee, status });
    resetForm();
  };
  return (
    <form className={styles.form}>
      <input
        type="text"
        name="question"
        placeholder="Question"
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
      />
      <input
        type="text"
        name="askee"
        placeholder="Askee"
        onChange={(e) => setAskee(e.target.value)}
        value={askee}
      />
      <button
        type="button"
        title={ACCEPTED}
        onClick={() => handleSubmit(ACCEPTED)}
        disabled={!question || !askee}
      >
        ✅
      </button>
      <button
        type="button"
        title={REJECTED}
        onClick={() => handleSubmit(REJECTED)}
        disabled={!question || !askee}
      >
        ❌
      </button>
      <button
        type="button"
        title={UNANSWERED}
        onClick={() => handleSubmit(UNANSWERED)}
        disabled={!question || !askee}
      >
        🕑
      </button>
    </form>
  );
};

QuestionForm.propTypes = {
  onSubmit: func,
};
