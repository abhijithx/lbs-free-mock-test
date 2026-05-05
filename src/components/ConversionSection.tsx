import React from 'react';
import type { Category } from '../types';
import { CheckCircle2, Play, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  weakCategory: Category;
}

const courseData: Record<string, any> = {
  'Maths': {
    title: 'Advanced Mathematics Mastery',
    description: 'Transform your mathematical intuition. Our proprietary framework helps you solve complex problems in half the time.',
    benefits: ['Strategic Problem Solving', 'Real-world Applications', '1-on-1 Mentorship Session'],
    videoPlaceholder: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
  },
  'CS': {
    title: 'Computer Science Architecture',
    description: 'Master the fundamental principles of systems and software design used by engineers at top tech companies.',
    benefits: ['System Design Patterns', 'Efficiency Optimization', 'Industry-standard Projects'],
    videoPlaceholder: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
  },
  'English': {
    title: 'Professional Communication & Rhetoric',
    description: 'Elevate your verbal and written impact. Learn the art of persuasive communication for professional success.',
    benefits: ['Executive Communication', 'Advanced Vocabulary', 'Writing Workshops'],
    videoPlaceholder: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
  },
  'Aptitude': {
    title: 'Cognitive Reasoning Intensive',
    description: 'Unlock your cognitive potential. This bootcamp sharpens your logical processing and pattern recognition.',
    benefits: ['Logical Shortcuts', 'Pattern Decoding', 'Decision-making Frameworks'],
    videoPlaceholder: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800',
  },
  'GK': {
    title: 'General Awareness Strategy',
    description: 'Stay ahead of the curve with our curated GK modules. Perfect for competitive exam aspirants.',
    benefits: ['Daily Current Affairs', 'Static GK Vault', 'Monthly Recaps'],
    videoPlaceholder: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
  }
};

export default function ConversionSection({ weakCategory }: Props) {
  const course = courseData[weakCategory] || courseData['Maths'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '32px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ padding: '60px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: '#f1f5f9', borderRadius: '20px', marginBottom: '24px' }}>
            <Sparkles style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#475569', letterSpacing: '1px' }}>Recommended Pathway</span>
          </div>
          
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', lineHeight: 1.2, margin: '0 0 20px 0' }}>
            Bridge the Gap in <span style={{ color: '#2563eb' }}>{weakCategory}</span>
          </h2>
          
          <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.6, margin: '0 0 32px 0', fontWeight: 500 }}>
            {course.description}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
            {course.benefits.map((benefit: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>{benefit}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ padding: '16px 32px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
              Join Course <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
            <button style={{ padding: '16px 32px', backgroundColor: '#f8fafc', color: '#475569', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
              Curriculum
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          <img 
            src={course.videoPlaceholder} 
            alt="Course Preview" 
            style={{ width: '100%', height: '400px', objectCover: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 15px rgba(0,0,0,0.2)' }}>
              <Play style={{ width: '20px', height: '20px', color: '#000000', fill: '#000000', marginLeft: '3px' }} />
            </div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Preview Lecture</p>
            <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>{course.title}</h4>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
