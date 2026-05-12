import { useState, useRef, useEffect } from 'react';
import type { TestResult, Question, Category } from '../types';
import {
  TrendingUp, AlertCircle, RefreshCw, ArrowRight, Play, Pause,
  Check, X, Minus, Sparkles, Clock, Target, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  result: TestResult;
  questions: Question[];
  onReset: () => void;
}

const VIDEOS = [
  { id: 1, title: 'CS Fundamentals: Memory Management', description: 'Deep dive into how systems handle memory allocation and pointers.', src: '/videos/amarjith.mp4', poster: 'https://images.unsplash.com/photo-1509228463558-ce2ecd3e401b?auto=format&fit=crop&q=80&w=600' },
  { id: 2, title: 'English Grammar & Rhetoric', description: 'Eliminate common grammatical errors and improve your verbal score instantly.', src: '/videos/akshay.mp4', poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600' },
  { id: 3, title: 'Mathematics: Coordinate Geometry', description: 'Strengthen your understanding of coordinate geometry with comprehensive guidance.', src: '/videos/jumna.mp4', poster: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600' },
  { id: 4, title: 'General Knowledge: Current Affairs', description: 'Everything you need to know about current affairs for this year.', src: '/videos/abhinav.mp4', poster: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600' },
  { id: 5, title: 'Quantitative Aptitude: Percentages', description: 'Master percentages and their applications in real exam scenarios.', src: '/videos/sourav.mp4', poster: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600' },
];

function VideoCard({ video, activeVideoId, setActiveVideoId }: {
  video: typeof VIDEOS[0];
  activeVideoId: number | null;
  setActiveVideoId: (id: number | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveVideoId(video.id);
        else if (activeVideoId === video.id) setActiveVideoId(null);
      });
    }, { threshold: 0.6 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [video.id, setActiveVideoId, activeVideoId]);

  useEffect(() => {
    if (!videoRef.current) return;
    const shouldPlay = activeVideoId === video.id;
    if (shouldPlay) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeVideoId, video.id]);

  const toggle = () => isPlaying ? setActiveVideoId(null) : setActiveVideoId(video.id);

  return (
    <div ref={containerRef} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col">
      <div className="relative aspect-video bg-slate-100 cursor-pointer" onClick={toggle}>
        <video ref={videoRef} src={video.src} poster={video.poster} loop playsInline className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
            {isPlaying ? <Pause className="text-slate-900 fill-slate-900 w-5 h-5" /> : <Play className="text-slate-900 fill-slate-900 w-5 h-5 ml-0.5" />}
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h4 className="text-base font-black text-slate-900 mb-1.5 leading-tight">{video.title}</h4>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4 flex-1 line-clamp-2">{video.description}</p>
        <a href="https://lbscourse.cetmca.in/" target="_blank" rel="noopener noreferrer"
          className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-2 group">
          Join Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}

// Format seconds to mm:ss
function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export default function ResultPage({ result, questions, onReset }: Props) {
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  if (!result?.categoryScores || !result?.userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl max-w-sm w-full border border-slate-100">
          <AlertCircle className="text-red-500 w-14 h-14 mx-auto mb-5" />
          <h2 className="text-2xl font-black text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-8 font-medium">We couldn't process your results.</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Reload
          </button>
        </div>
      </div>
    );
  }

  const total = result.totalQuestions || questions.length || 120;
  const accuracy = Math.round((result.totalScore / total) * 100);

  const scores = Object.entries(result.categoryScores) as [Category, number][];
  const weakCategory = scores.reduce((a, b) => {
    const totA = result.categoryTotals?.[a[0]] ?? 1;
    const totB = result.categoryTotals?.[b[0]] ?? 1;
    return (a[1] / totA) < (b[1] / totB) ? a : b;
  })[0];

  const performanceMsg = accuracy >= 80
    ? "Outstanding! Your grasp of the concepts is exceptional. Keep it up!"
    : accuracy >= 60
    ? "Solid performance! A bit more focus on weak areas and you'll excel."
    : "Good start! Focus on fundamentals in lower-scoring categories to bridge the gap.";

  const answeredCount = Object.keys(result.answers).length;
  const skippedCount = total - answeredCount;

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter']">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* 1. Result Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 md:p-12 flex flex-col lg:flex-row gap-8 md:gap-10 items-start lg:items-center relative overflow-hidden mb-6"
        >
          <div className="flex-1">
            <div className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-4 border border-blue-100">
              Exam Summary
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Results for <span className="text-blue-600">{result.userData.name}</span>
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed max-w-lg text-sm md:text-base">{performanceMsg}</p>
          </div>

          {/* Score Stats */}
          <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="bg-blue-50 p-4 md:p-6 rounded-2xl border border-blue-100 text-center">
              <Target className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
              <p className="text-2xl md:text-3xl font-black text-blue-600 tracking-tighter">{result.totalScore}</p>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Score</p>
            </div>
            <div className="bg-emerald-50 p-4 md:p-6 rounded-2xl border border-emerald-100 text-center">
              <Award className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-2xl md:text-3xl font-black text-emerald-500 tracking-tighter">{accuracy}%</p>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Accuracy</p>
            </div>
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200 text-center">
              <Minus className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
              <p className="text-2xl md:text-3xl font-black text-slate-600 tracking-tighter">{skippedCount}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skipped</p>
            </div>
            <div className="bg-amber-50 p-4 md:p-6 rounded-2xl border border-amber-100 text-center">
              <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
              <p className="text-lg md:text-2xl font-black text-amber-600 tracking-tighter">{formatTime(result.timeTaken ?? 0)}</p>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Time Taken</p>
            </div>
          </div>
        </motion.div>

        {/* 2. Category Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {scores.map(([cat, score]) => {
            const max = result.categoryTotals?.[cat] ?? 1;
            const pct = Math.round((score / max) * 100);
            return (
              <div key={cat} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{cat}</p>
                <p className="text-xl font-black text-slate-900 mb-2">{score}<span className="text-slate-300 font-bold text-sm">/{max}</span></p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10px] font-black text-slate-400 mt-1">{pct}%</p>
              </div>
            );
          })}
        </div>

        {/* 3. Performance Insight */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 mb-6">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shrink-0">
            <TrendingUp className="text-amber-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900 mb-1">Performance Insight</h3>
            <p className="text-slate-600 text-sm md:text-base font-medium">
              Your <span className="text-blue-600 font-bold">{weakCategory}</span> score is your weakest area.
              Improving it can significantly boost your overall rank.
            </p>
          </div>
        </div>

        {/* 4. Course Promo */}
        <div className="mb-8 bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10 mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/20 rounded-full mb-4 border border-blue-600/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">LBS Foundation Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">Improve Your Weak Areas</h2>
            <p className="text-slate-400 font-medium text-sm sm:text-base max-w-2xl mx-auto">
              Students of <span className="text-white font-bold">Computer Applications at CET</span> present an LBS MCA Crash Course — designed to help you prepare effectively for just{' '}
              <span className="text-emerald-400 font-black">₹350</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VIDEOS.map(video => (
              <VideoCard key={video.id} video={video} activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <a href="https://lbscourse.cetmca.in/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-base shadow-2xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all hover:-translate-y-0.5 active:translate-y-0">
              JOIN NOW — ONLY ₹350 <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* 5. Detailed Analysis */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-wider shrink-0">Detailed Analysis</h2>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAnswer = result.answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              const isSkipped = userAnswer === undefined;

              return (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${
                      isCorrect ? 'bg-emerald-100 text-emerald-600' :
                      isSkipped ? 'bg-slate-100 text-slate-500' :
                                  'bg-red-100 text-red-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{q.category}</span>
                        {isCorrect && <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"><Check className="w-3 h-3" /> CORRECT</span>}
                        {!isCorrect && !isSkipped && <span className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100"><X className="w-3 h-3" /> INCORRECT</span>}
                        {isSkipped && <span className="flex items-center gap-1 text-[10px] font-black text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200"><Minus className="w-3 h-3" /> SKIPPED</span>}
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-slate-800 leading-snug">{q.question}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-10 md:pl-11">
                    {q.options.map((option, optIdx) => {
                      const isCorrectOpt = optIdx === q.correctAnswer;
                      const isSelectedOpt = optIdx === userAnswer;
                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-sm font-semibold ${
                            isCorrectOpt   ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                            isSelectedOpt  ? 'bg-red-50 border-red-200 text-red-900' :
                                             'bg-slate-50 border-slate-100 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black border shrink-0 ${
                              isCorrectOpt  ? 'bg-emerald-500 border-emerald-500 text-white' :
                              isSelectedOpt ? 'bg-red-500 border-red-500 text-white' :
                                              'bg-white border-slate-200 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="leading-snug">{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 shadow-2xl z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-black text-sm hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={16} /> RETAKE TEST
          </button>
          <a
            href="https://lbscourse.cetmca.in/" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all"
          >
            GET COURSE ACCESS <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
