import React, { useState } from 'react';
import type { UserData } from '../types';
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onStart: (data: UserData) => void;
}

export default function LandingPage({ onStart }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone.length >= 10) {
      onStart({ name, phone });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', position: 'fixed', width: '100%', zIndex: 100, display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#2563eb', padding: '10px', borderRadius: '12px' }}>
              <GraduationCap style={{ color: '#ffffff', width: '24px', height: '24px' }} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>CET MOCK TEST</span>
          </div>
          <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: 700, color: '#64748b' }}>
            
            <span style={{ cursor: 'pointer' }}>Curriculum</span>
            <span style={{ cursor: 'pointer', color: '#2563eb' }}>Join LBS MCA  Prep</span>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 40px 60px 40px' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }}>
          
          {/* Left Side: Brand Text */}
          <div style={{ textAlign: 'left' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              
              <h1 style={{ fontSize: '64px', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-2px', margin: '0 0 32px 0' }}>
               Test your knowledge with<br></br><span style={{ color: '#2563eb' }}>FREE MOCK TEST</span>
              </h1>
              <p style={{ fontSize: '20px', color: '#64748b', lineHeight: 1.6, maxWidth: '540px', margin: '0 0 48px 0', fontWeight: 500 }}>
                mock test crafted by students of Computer Applications at the College of Engineering Trivandrum. This test is built to reflect real exam patterns, helping you evaluate your performance with precision. Get instant results, detailed analytics, and category-wise scoring across CS, Maths, Aptitude, English, and GK. Identify your strengths, uncover areas for improvement, and take the next step toward your goals with confidence.
              </p>
            </motion.div>
          </div>  
          {/* Right Side: Professional Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ backgroundColor: '#ffffff', padding: '50px', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>Register Now</h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  style={{ padding: '16px 20px', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '16px', outline: 'none', transition: 'all 0.2s ease', backgroundColor: '#f8fafc' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  style={{ padding: '16px 20px', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '16px', outline: 'none', transition: 'all 0.2s ease', backgroundColor: '#f8fafc' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={!name || phone.length < 10}
                style={{
                  marginTop: '12px',
                  padding: '20px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  opacity: (!name || phone.length < 10) ? 0.6 : 1,
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
                }}
              >
                START MOCK TEST
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </button>
            </form>

          
          </motion.div>
        </div>
      </main>

      <footer style={{ padding: '40px', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>© 2026 CET Computer Application Department</p>
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#cbd5e1', fontWeight: 700 }}>
            <span>Privacy Policy</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
