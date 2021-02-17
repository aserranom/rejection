import { connect } from 'react-redux';

import { getTodayScore, getTotalScore } from '../../reducer/reducer';
import { ScoreCards } from './ScoreCards';

const mapStateToProps = (state) => ({
  todayScore: getTodayScore(state),
  totalScore: getTotalScore(state),
});

export const ScoreCardsContainer = connect(mapStateToProps)(ScoreCards);
