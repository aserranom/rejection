import { bool, func, number, object } from 'prop-types';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import { STATUSES } from '../../reducer/reducer';

import * as styles from './Question.module.css';

const cx = classnames.bind(styles);

const { ACCEPTED, REJECTED, UNANSWERED } = STATUSES;

export const Question = ({
  question: { id, question, askee, status, timestamp },
  score,
  edit,
  onAnswer,
  onEdit,
}) => {
  const isUnanswered = status === UNANSWERED;
  const date = isUnanswered ? 'TBD' : new Date(timestamp).toLocaleDateString();
  // TODO: Manage all question edition info with redux
  const [formData, setFormData] = useState({ question, askee, status });
  const handleChange = (prop, value) =>
    setFormData((o) => ({ ...o, [prop]: value }));
  useEffect(() => {
    setFormData({ question, askee, status });
  }, [question, askee, status]);
  return (
    <div className={styles.card}>
      <div className={styles.leftWrapper}>
        {edit ? (
          <input
            type="text"
            name="question"
            className={styles.question}
            value={formData.question}
            onChange={(e) => handleChange('question', e.target.value)}
          />
        ) : (
          <p className={styles.question}>{question}</p>
        )}
        <div className={styles.details}>
          {edit ? (
            <input
              type="text"
              name="askee"
              value={formData.askee}
              onChange={(e) => handleChange('askee', e.target.value)}
            />
          ) : (
            askee
          )}{' '}
          - {date}
        </div>
      </div>
      <div className={styles.rightWrapper}>
        {edit ? (
          <select
            name="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {Object.values(STATUSES).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          <>
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
          </>
        )}
      </div>
      <a
        className={cx({ editWrapper: true, edit })}
        onClick={() => onEdit(formData)}
      >
        {edit ? '👍' : '✏️'}
      </a>
    </div>
  );
};

Question.propTypes = {
  question: object,
  onAnswer: func,
  onEdit: func,
  edit: bool,
  score: number,
};
