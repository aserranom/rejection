import React from 'react';

import { useAppState } from '../../../app/providers/AppProvider';
import { addQuestion } from '../../reducer/reducer';
import { QuestionForm } from './QuestionForm';

export const QuestionFormContainer = () => {
  const { dispatch } = useAppState();
  const handleSubmit = (question) => dispatch(addQuestion(question));
  return <QuestionForm onSubmit={handleSubmit} />;
};
