import { connect } from 'react-redux';

import { addQuestion } from '../../reducer/reducer';
import { QuestionForm } from './QuestionForm';

const actionCreators = {
  onSubmit: addQuestion,
};

export const QuestionFormContainer = connect(
  null,
  actionCreators
)(QuestionForm);
