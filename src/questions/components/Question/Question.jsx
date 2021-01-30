import { func, object } from 'prop-types';
import React from 'react';

import { getSingleScore, STATUSES } from '../../reducer/reducer';

import * as styles from './Question.module.css';

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

export const Question = ({
  question: { id, question, askee, status, timestamp },
  onAnswer,
}) => {
  const isUnanswered = status === UNANSWERED;
  const date = isUnanswered ? 'TBD' : new Date(timestamp).toLocaleDateString();
  const score = getSingleScore({ status });
  return (
    <div className={styles.card}>
      <div className={styles.leftWrapper}>
        <p className={styles.question}>{question}</p>
        <div className={styles.details}>
          {askee} - {date}
        </div>
      </div>
      <div className={styles.rightWrapper}>
        {isUnanswered ? (
          <div className={styles.answerButtons}>
            <button onClick={() => onAnswer({ id, status: ACCEPTED })}>
              ✅
            </button>
            <button onClick={() => onAnswer({ id, status: REJECTED })}>
              ❌
            </button>
          </div>
        ) : (
          <span className={styles.score}>{score}</span>
        )}
        <div className={styles.scoreStatus}>{status}</div>
      </div>
    </div>
  );
};

Question.propTypes = {
  question: object,
  onAnswer: func,
};
