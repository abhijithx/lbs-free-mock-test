import React, { useState, useEffect, useCallback } from 'react';
import { questions } from '../data/questions';
import type { UserData, TestResult, Category } from '../types';
import { Timer, ArrowRight, ArrowLeft, Send, Flag, User, CheckCircle2, Bookmark, Info, Clock } from 'lucide-react';
import { saveResult } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  userData: UserData;
  onComplete: (result: TestResult) => void;
}

const TEST_DURATION = 90 * 60;

export default function QuizEngine({ userData, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('CS');
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    const firstIdxOfCat = questions.findIndex(q => q.category === cat);
    setCurrentIdx(firstIdxOfCat);
  };

  // Simplified handleSubmit to ensure it's always functional
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    
    const confirmSubmit = window.confirm("Are you sure you want to finalize and submit the test?");
    if (!confirmSubmit) return;
    
    setIsSubmitting(true);
    console.log("Submitting test...");

    const categoryScores: Record<Category, number> = {
      'CS': 0, 'Maths': 0, 'Aptitude': 0, 'English': 0, 'GK': 0
    };

    let totalScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        categoryScores[q.category] += 1;
        totalScore += 1;
      }
    });

    const finalResult: TestResult = {
      userData, totalScore, categoryScores, answers, markedForReview, createdAt: new Date()
    };

    try {
      await saveResult(finalResult);
      onComplete(finalResult);
    } catch (err) {
      console.error("Submission failed:", err);
      // Still show results even if saving fails
      onComplete(finalResult);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit on time up
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (qId: string) => {
    if (markedForReview.includes(qId)) return 'review';
    if (answers[qId] !== undefined) return 'answered';
    if (currentIdx > questions.findIndex(q => q.id === qId)) return 'skipped';
    return 'unattempted';
  };

  const categoriesList: Category[] = ['CS', 'Maths', 'Aptitude', 'English', 'GK'];

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ height: '56px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: '#2563eb', padding: '5px', borderRadius: '6px' }}>
              <CheckCircle2 style={{ color: '#ffffff', width: '18px', height: '18px' }} />
            </div>
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '16px' }}>CET MOCK</span>
          </div>
          
          <nav style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '8px' }}>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeCategory === cat ? '#ffffff' : 'transparent',
                  color: activeCategory === cat ? '#2563eb' : '#64748b'
                }}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef2f2', padding: '5px 12px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
            <Clock style={{ width: '14px', height: '14px', color: '#ef4444' }} />
            <span style={{ fontFamily: 'monospace', color: '#b91c1c', fontWeight: 700, fontSize: '16px' }}>{formatTime(timeLeft)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#64748b' }}>{userData.name}</p>
            </div>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', overflow: 'hidden' }}>
        {/* Left: Question Card Area */}
        <main style={{ overflowY: 'auto', padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '3px 10px', borderRadius: '5px', fontSize: '10px', fontWeight: 900 }}>
                      Q {currentIdx + 1}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600 }}>{currentQuestion.category}</span>
                  </div>
                  <button 
                    onClick={() => setMarkedForReview(prev => 
                      prev.includes(currentQuestion.id) ? prev.filter(id => id !== currentQuestion.id) : [...prev, currentQuestion.id]
                    )}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: markedForReview.includes(currentQuestion.id) ? '#fffbeb' : 'transparent',
                      color: markedForReview.includes(currentQuestion.id) ? '#d97706' : '#94a3b8'
                    }}
                  >
                    <Bookmark style={{ width: '14px', height: '14px', fill: markedForReview.includes(currentQuestion.id) ? 'currentColor' : 'none' }} />
                    {markedForReview.includes(currentQuestion.id) ? 'Review' : 'Mark'}
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                    {currentQuestion.question}
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = answers[currentQuestion.id] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: idx }))}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: '1.5px solid',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderColor: isSelected ? '#2563eb' : '#f1f5f9',
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff'
                          }}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: '1.5px solid',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                            backgroundColor: isSelected ? '#2563eb' : 'transparent'
                          }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: isSelected ? '#ffffff' : '#94a3b8' }}>{String.fromCharCode(65 + idx)}</span>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? '#1e3a8a' : '#475569' }}>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  opacity: currentIdx === 0 ? 0.5 : 1
                }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Previous
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setAnswers(prev => {
                    const newAnswers = { ...prev };
                    delete newAnswers[currentQuestion.id];
                    return newAnswers;
                  })}
                  style={{ padding: '0 12px', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
                >
                  CLEAR
                </button>
                
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 32px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '13px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Next
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 32px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '13px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Submit
                    <Send style={{ width: '16px', height: '16px' }} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside style={{ backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 900, color: '#1e293b' }}>NAVIGATOR</h3>
              <div style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 800, color: '#64748b' }}>
                {Object.keys(answers).length}/{questions.length}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', borderRadius: '8px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#64728b' }}>Ans</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', borderRadius: '8px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#64728b' }}>Skip</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', borderRadius: '8px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#64728b' }}>Rev</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', borderRadius: '8px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#64728b' }}>Empty</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {questions.map((q, i) => {
                  if (q.category !== activeCategory) return null;
                  const status = getQuestionStatus(q.id);
                  const isCurrent = i === currentIdx;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(i)}
                      style={{
                        height: '32px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 800,
                        border: '1.5px solid',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: status === 'answered' ? '#10b981' : status === 'skipped' ? '#ef4444' : status === 'review' ? '#f59e0b' : '#f8fafc',
                        color: (status === 'answered' || status === 'skipped' || status === 'review') ? '#ffffff' : '#94a3b8',
                        borderColor: isCurrent ? '#2563eb' : 'transparent',
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button
                onClick={() => {
                  console.log("Finalize clicked");
                  handleFinalSubmit();
                }}
                id="finalize-test-btn"
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                FINALIZE TEST
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
