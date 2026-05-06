import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import QuizEngine from './components/QuizEngine';
import ResultPage from './components/ResultPage';
import type { UserData, TestResult } from './types';
import { AnimatePresence, motion } from 'framer-motion';

type AppState = 'landing' | 'quiz' | 'result';

function App() {
  // Initialize state from localStorage
  const [state, setState] = useState<AppState>(() => {
    return (localStorage.getItem('lbs_mock_state') as AppState) || 'landing';
  });
  
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('lbs_mock_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [result, setResult] = useState<TestResult | null>(() => {
    const saved = localStorage.getItem('lbs_mock_result');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('lbs_mock_state', state);
  }, [state]);

  useEffect(() => {
    if (userData) localStorage.setItem('lbs_mock_user', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    if (result) localStorage.setItem('lbs_mock_result', JSON.stringify(result));
  }, [result]);

  const handleStart = (data: UserData) => {
    setUserData(data);
    setState('quiz');
  };

  const handleComplete = (res: TestResult) => {
    setResult(res);
    setState('result');
    // Clear quiz progress once completed
    localStorage.removeItem('lbs_quiz_answers');
    localStorage.removeItem('lbs_quiz_current_idx');
    localStorage.removeItem('lbs_quiz_time');
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
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
            <QuizEngine userData={userData} onComplete={handleComplete} onExit={handleReset} />
          </motion.div>
        )}

        {state === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
              <button 
                onClick={handleReset}
                style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
              >
                Exit Results
              </button>
            </div>
            <ResultPage result={result} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
