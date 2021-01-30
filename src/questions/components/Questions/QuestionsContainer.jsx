import React from 'react';

import { useAppState } from '../../../app/providers/AppProvider';
import { sortQuestions } from '../../reducer/reducer';
import { Questions } from './Questions';

export const QuestionsContainer = () => {
  const { state: questions } = useAppState();
  const sortedQuestions = sortQuestions(questions);
  return <Questions questions={sortedQuestions} />;
};
