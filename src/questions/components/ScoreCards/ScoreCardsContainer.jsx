import React from 'react';

import { useAppState } from '../../../app/providers/AppProvider';
import { getTodayScore, getTotalScore } from '../../reducer/reducer';
import { ScoreCards } from './ScoreCards';

export const ScoreCardsContainer = () => {
  const { state: questions } = useAppState();
  const todayScore = getTodayScore(questions);
  const totalScore = getTotalScore(questions);
  return <ScoreCards totalScore={totalScore} todayScore={todayScore} />;
};
