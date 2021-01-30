import React from 'react';
import { number } from 'prop-types';

import * as styles from './ScoreCards.module.css';

export const ScoreCards = ({ todayScore = 0, totalScore = 0 }) => {
  return (
    <div className={styles.scoreCards}>
      <p>
        <strong>Today&apos;s Score:</strong>
      </p>
      <p className={styles.todayScore}>{todayScore}</p>
      <div className={styles.divider} />
      <p>
        Total Score: <span className={styles.totalScore}>{totalScore}</span>
      </p>
    </div>
  );
};

ScoreCards.propTypes = {
  todayScore: number,
  totalScore: number,
};
