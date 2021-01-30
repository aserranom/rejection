import React from 'react';
import { useAppState } from '../../../app/providers/AppProvider';
import { answerQuestion, getSingleScore } from '../../reducer/reducer';
import { Question } from './Question';

export const QuestionContainer = ({ question = {} }) => {
  const score = getSingleScore(question);
  const { dispatch } = useAppState();
  const handleAnswer = ({ id, status }) => {
    dispatch(answerQuestion({ id, status }));
  };

  return <Question question={question} score={score} onAnswer={handleAnswer} />;
};
