import { connect } from 'react-redux';

import { sortQuestions } from '../../reducer/reducer';
import { Questions } from './Questions';

const mapStateToProps = (state) => ({
  questions: sortQuestions(state),
});

export const QuestionsContainer = connect(mapStateToProps)(Questions);
