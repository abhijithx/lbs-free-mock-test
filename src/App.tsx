import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import QuizEngine from './components/QuizEngine';
import ResultPage from './components/ResultPage';
import type { UserData, TestResult } from './types';
import { AnimatePresence, motion } from 'framer-motion';

type AppState = 'landing' | 'quiz' | 'result';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleStart = (data: UserData) => {
    setUserData(data);
    setState('quiz');
  };

  const handleComplete = (res: TestResult) => {
    setResult(res);
    setState('result');
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {state === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <LandingPage onStart={handleStart} />
          </motion.div>
        )}

        {state === 'quiz' && userData && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <QuizEngine userData={userData} onComplete={handleComplete} />
          </motion.div>
        )}

        {state === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <ResultPage result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
