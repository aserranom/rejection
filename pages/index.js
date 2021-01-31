import React from 'react';
import Head from 'next/head';

import { QuestionFormContainer } from '../src/questions/components/QuestionForm/QuestionFormContainer';
import { QuestionsContainer } from '../src/questions/components/Questions/QuestionsContainer';
import { ScoreCardsContainer } from '../src/questions/components/ScoreCards/ScoreCardsContainer';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>The Rejection App</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>The Rejection App</h1>
        <p>
          <em>You gotta lose to win.</em>
        </p>
        <ScoreCardsContainer />
        <QuestionFormContainer />
        <QuestionsContainer />
      </div>
    </>
  );
}

/*

Notes to self: 
- Isolate side-effects and non-determinism to action creators (id generation, io, etc)
- Implement redux, add filtering and sorting
- Containers to provide state to pure components
- Don't write separate unit tests for action creators and selectors (*)
- Rewrite action types as feature/type (eg: question/addQuestion)
- Functional Tests for Container Components
- Verify, pure components can hold their own local state right?
*/
