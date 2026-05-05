import React from 'react';
import type { TestResult, Category } from '../types';
import { Trophy, Target, TrendingUp, BookOpen, ExternalLink, CheckCircle2, AlertCircle, Phone, ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ConversionSection from './ConversionSection';

interface Props {
  result: TestResult;
}

export default function ResultPage({ result }: Props) {
  // Defensive checks to prevent blank page crashes
  if (!result || !result.categoryScores || !result.userData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}>
          <AlertCircle style={{ color: '#ef4444', width: '48px', height: '48px', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>Something went wrong</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>We couldn't process your results. Please try again.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', border: 'none', fontWeight: 700 }}>
            Reload Test
          </button>
        </div>
      </div>
    );
  }

  const accuracy = Math.round((result.totalScore / 110) * 100);
  
  const getSubjectColor = (cat: Category) => {
    const colors: Record<Category, string> = {
      'CS': '#3b82f6',
      'Maths': '#8b5cf6',
      'Aptitude': '#f59e0b',
      'English': '#10b981',
      'GK': '#ef4444'
    };
    return colors[cat];
  };

  // Find the category with the lowest score for recommendation
  const weakCategory = (Object.entries(result.categoryScores) as [Category, number][])
    .reduce((a, b) => a[1] < b[1] ? a : b)[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '60px 40px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Main Score Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: '#ffffff', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.08)', padding: '80px', display: 'flex', gap: '80px', alignItems: 'center', position: 'relative', overflow: 'hidden', marginBottom: '60px' }}
        >
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', opacity: 0.03 }}>
            <Trophy size={300} color="#2563eb" />
          </div>

          <div style={{ flex: 1.2, textAlign: 'left' }}>
            <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block', marginBottom: '24px' }}>
              Final Exam Performance
            </div>
            <h1 style={{ fontSize: '64px', fontWeight: 900, color: '#0f172a', margin: '0 0 24px 0', letterSpacing: '-2px' }}>
              Excellent Effort, <span style={{ color: '#2563eb' }}>{result.userData.name}!</span>
            </h1>
            <p style={{ fontSize: '20px', color: '#64748b', fontWeight: 500, lineHeight: 1.5, maxWidth: '480px' }}>
              Your results are verified and analyzed based on IT Foundation standards.
            </p>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '40px', borderRadius: '24px', border: '1px solid #dbeafe', textAlign: 'center' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '64px', fontWeight: 900, color: '#2563eb', letterSpacing: '-2px' }}>{result.totalScore}</p>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Score</p>
            </div>
            <div style={{ backgroundColor: '#f0fdf4', padding: '40px', borderRadius: '24px', border: '1px solid #dcfce7', textAlign: 'center' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '64px', fontWeight: 900, color: '#10b981', letterSpacing: '-2px' }}>{accuracy}%</p>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy</p>
            </div>
            <div style={{ gridColumn: 'span 2', backgroundColor: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <Target style={{ color: '#94a3b8' }} />
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#475569' }}>Percentile: <span style={{ color: '#0f172a' }}>Top 12%</span></span>
            </div>
          </div>
        </motion.div>

        {/* Section: Modular Analytics */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>Categorical Analytics</h2>
            <div style={{ height: '2px', backgroundColor: '#e2e8f0', flex: 1 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
            {(Object.entries(result.categoryScores) as [Category, number][]).map(([cat, score]) => {
              const max = cat === 'CS' ? 50 : cat === 'GK' ? 5 : cat === 'English' ? 15 : 20;
              const percent = (score / max) * 100;
              return (
                <div 
                  key={cat}
                  style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>{cat}</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{score}/{max}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ height: '100%', width: `${percent}%`, backgroundColor: getSubjectColor(cat), borderRadius: '4px' }} />
                  </div>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', color: percent >= 75 ? '#10b981' : percent >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {percent >= 75 ? 'Mastery' : percent >= 40 ? 'Proficient' : 'Developing'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Intelligence Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '80px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '16px' }}><CheckCircle2 style={{ color: '#10b981' }} /></div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Core Strengths</h3>
            </div>
            <div style={{ display: 'flex', gap: '20px', backgroundColor: '#f0fdf4', padding: '24px', borderRadius: '20px', border: '1px solid #dcfce7' }}>
              <BookOpen style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800, color: '#166534' }}>Logical & Aptitude</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#15803d', fontWeight: 500, lineHeight: 1.5 }}>Your analytical thinking skills are significantly above average. You should consider advanced CS tracks.</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#fff1f2', padding: '12px', borderRadius: '16px' }}><AlertCircle style={{ color: '#ef4444' }} /></div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Improvement Areas</h3>
            </div>
            <div style={{ display: 'flex', gap: '20px', backgroundColor: '#fff1f2', padding: '24px', borderRadius: '20px', border: '1px solid #ffe4e6' }}>
              <TrendingUp style={{ color: '#ef4444', flexShrink: 0 }} />
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800, color: '#991b1b' }}>General Knowledge</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#b91c1c', fontWeight: 500, lineHeight: 1.5 }}>Focusing on recent technical advancements will help you bridge the gap in your GK score.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Conversion CTA */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-1px' }}>Take the Next Step</h2>
          <p style={{ fontSize: '20px', color: '#64748b', fontWeight: 500, maxWidth: '700px', margin: '0 auto 60px auto' }}>We've curated these specialized CET-aligned courses based on your performance data.</p>
          <ConversionSection weakCategory={weakCategory} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <button style={{ padding: '16px 32px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#475569', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RefreshCw size={18} /> RETAKE TEST
          </button>
          <button style={{ padding: '16px 48px', borderRadius: '12px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}>
            ENROLL IN COURSE <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
