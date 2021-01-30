import React from 'react';
import { array } from 'prop-types';

import { QuestionContainer } from '../Question/QuestionContainer';

import * as styles from './Questions.module.css';

export const Questions = ({ questions = [] }) => {
  return (
    <div className={styles.questionsWrapper}>
      {questions.map((question) => (
        <QuestionContainer key={question.id} question={question} />
      ))}
    </div>
  );
};

Questions.propTypes = {
  questions: array,
};
