import React, { useState } from 'react';
import type { UserData } from '../types';
import { GraduationCap, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 py-4 fixed w-full z-[100] flex justify-center shadow-sm px-6">
        <div className="max-w-7xl w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">LBS MCA MOCK TEST</span>
          </div>
          <div className="hidden md:flex gap-10 text-sm font-bold text-slate-500 items-center">
            
            <button className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all font-black text-xs uppercase tracking-widest" onClick={()=> window.location.href = "https://lbscourse.cetmca.in/"}>
              Join LBS MCA Prep
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex items-center justify-center pt-28 pb-16 px-6 md:px-10 lg:pt-32">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Brand Text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
                Test your knowledge with<br />
                <span className="text-blue-600">FREE MOCK TEST</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl lg:max-w-[540px] mb-12 font-medium mx-auto lg:mx-0">
                mock test crafted by <span className="text-red-600 font-bold">students of Computer Applications</span> at the<span className="text-red-600 font-bold"> College of Engineering Trivandrum(CET)</span>. This test is built to reflect real exam patterns, helping you evaluate your performance with precision. Get instant results, detailed analytics, and category-wise scoring across CS, Maths, Aptitude, English, and GK.
              </p>
            </motion.div>
          </div>  

          {/* Right Side: Professional Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 md:p-10 lg:p-12 rounded-3xl md:rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/40 relative overflow-hidden"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Register Now</h3>
              <p className="text-slate-500 font-medium text-sm">Enter your details to start the exam</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="px-5 py-4 rounded-2xl border-2 border-slate-100 text-base outline-none focus:border-blue-600 transition-all bg-slate-50 text-slate-900 font-semibold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  className="px-5 py-4 rounded-2xl border-2 border-slate-100 text-base outline-none focus:border-blue-600 transition-all bg-slate-50 text-slate-900 font-semibold"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={!name || phone.length < 10}
                className={`mt-3 py-5 px-8 bg-blue-600 text-white rounded-2xl text-base md:text-lg font-black border-none cursor-pointer flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] ${
                  (!name || phone.length < 10) ? 'opacity-60 cursor-not-allowed' : 'opacity-100'
                }`}
              >
                START MOCK TEST
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <footer className="px-6 py-10 md:px-10 border-t border-slate-200 bg-white flex justify-center mt-auto">
        <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400 font-bold text-center md:text-left">© 2026 CET Computer Application Department</p>
          <div className="flex gap-8 text-sm text-slate-300 font-bold">
            <span className="hover:text-slate-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-500 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
