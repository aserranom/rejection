import { func } from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  answerQuestion,
  editQuestion,
  getSingleScore,
} from '../../reducer/reducer';
import { Question } from './Question';

const QuestionContainerUnwrapped = ({ question = {}, dispatch }) => {
  const score = getSingleScore(question);
  const handleAnswer = ({ id, status }) => {
    dispatch(answerQuestion({ id, status }));
  };
  const [isEditting, setIsEditting] = useState(false);
  const handleEdit = (updatedQuestion) => {
    isEditting &&
      dispatch(editQuestion({ id: question.id, ...updatedQuestion }));
    setIsEditting(!isEditting);
  };

  return (
    <Question
      question={question}
      score={score}
      onAnswer={handleAnswer}
      onEdit={handleEdit}
      edit={isEditting}
    />
  );
};

QuestionContainerUnwrapped.propTypes = {
  question: func,
  dispatch: func,
};

export const QuestionContainer = connect()(QuestionContainerUnwrapped);
