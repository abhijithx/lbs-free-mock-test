import { useState, useRef, useEffect } from 'react';
import type { TestResult, Category } from '../types';
import { questions as allQuestions } from '../data/questions';
import { 
  TrendingUp, AlertCircle, RefreshCw, ArrowRight, Play, Pause,
  Check, X, Minus, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import local videos
interface Props {
  result: TestResult;
  onReset: () => void;
}

const VIDEOS = [
  {
    id: 1,
    title: "CS Fundamentals: Memory Management",
    description: "Deep dive into how the systems handle memory allocation and pointers.",
    src: "/videos/amarjith.mp4",
    poster: "https://images.unsplash.com/photo-1509228463558-ce2ecd3e401b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "English Grammar & Rhetoric",
    description: "Eliminate common grammatical errors and improve your verbal score instantly.",
    src: "/videos/akshay.mp4",
    poster: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Mathematics : coordinate geometry",
    description: "Strengthen your understanding of coordinate geometry with our comprehensive guidance and problem-solving strategies.",
    src: "/videos/jumna.mp4",
    poster: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
   title: "General Knowledge:Current Affairs",
    description: "Everything you need to know about current affairs for this year",
    src: "/videos/abhinav.mp4",
    poster: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    title: "Quantitative Aptitude :Percentage",
    description:"Percentage is a way of expressing a number as a fraction of 100. It is a widely used concept in mathematics and is used to solve various problems related to discounts, interest, and profit and loss.",
    src: "/videos/sourav.mp4",
    poster: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
  }
];

function VideoCard({ 
  video, 
  activeVideoId, 
  setActiveVideoId 
}: { 
  video: typeof VIDEOS[0], 
  activeVideoId: number | null,
  setActiveVideoId: (id: number | null) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Intersection Observer for Mobile Autoplay
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveVideoId(video.id);
          } else if (activeVideoId === video.id) {
            setActiveVideoId(null);
          }
        });
      },
      { threshold: 0.6 } // Play when 60% of the card is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [video.id, setActiveVideoId, activeVideoId]);

  // Sync playback with activeVideoId
  useEffect(() => {
    if (!videoRef.current) return;

    const shouldPlay = activeVideoId === video.id || (isHovered && window.innerWidth >= 1024);

    if (shouldPlay) {
      const playVideo = async () => {
        try {
          videoRef.current!.muted = false;
          videoRef.current!.volume = 1;
          await videoRef.current!.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Playback failed:", err);
        }
      };
      playVideo();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeVideoId, video.id, isHovered]);

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
    if (window.innerWidth >= 1024) {
      if (hovering) {
        setActiveVideoId(video.id);
      } else if (activeVideoId === video.id) {
        setActiveVideoId(null);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(video.id);
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group h-full flex flex-col"
    >
      <div className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'} lg:hidden`}>
           <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
             {isPlaying ? <Pause className="text-slate-900 fill-slate-900 w-5 h-5" /> : <Play className="text-slate-900 fill-slate-900 w-5 h-5 ml-1" />}
           </div>
        </div>
        {/* Desktop Play Icon on Hover */}
        <div className={`absolute inset-0 bg-black/10 items-center justify-center hidden lg:flex transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
           <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
             <Play className="text-white fill-white w-6 h-6 ml-1" />
           </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{video.title}</h4>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
            {video.description}
          </p>
        </div>
        
        <a 
          href="https://lbscourse.cetmca.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-2 group/btn"
        >
          Join Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
}

export default function ResultPage({ result, onReset }: Props) {
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  if (!result || !result.categoryScores || !result.userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center p-8 md:p-12 bg-white rounded-3xl shadow-xl shadow-slate-200/50 max-w-md w-full border border-slate-100">
          <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-8 font-medium">We couldn't process your results.</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Reload Test
          </button>
        </div>
      </div>
    );
  }

  const accuracy = Math.round((result.totalScore / 110) * 100);
  
  // Find weak category
  const scores = Object.entries(result.categoryScores) as [Category, number][];
  const weakCategory = scores.reduce((a, b) => {
    const maxA = a[0] === 'CS' ? 50 : a[0] === 'GK' ? 5 : a[0] === 'English' ? 10 : a[0] === 'Maths' ? 25 : 20;
    const maxB = b[0] === 'CS' ? 50 : b[0] === 'GK' ? 5 : b[0] === 'English' ? 10 : b[0] === 'Maths' ? 25 : 20;
    return (a[1]/maxA) < (b[1]/maxB) ? a : b;
  })[0];

  const getPerformanceMessage = () => {
    if (accuracy >= 80) return "You're a high achiever! Your grasp of the core concepts is outstanding.";
    if (accuracy >= 60) return "Solid performance! With a bit more focus on your weak areas, you'll be unstoppable.";
    return "Good start! Focus on the fundamentals in your lower-scoring categories to bridge the gap.";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-8 py-10 md:py-16 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. RESULT SUMMARY */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] md:rounded-[48px] border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-12 lg:p-20 flex flex-col lg:flex-row gap-12 md:gap-16 items-center relative overflow-hidden mb-12 md:mb-16"
        >
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[11px] md:text-xs font-black uppercase tracking-[0.15em] inline-block mb-6 border border-blue-100">
              Exam Summary
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1]">
              Results for <span className="text-blue-600">{result.userData.name}</span>
            </h1>
            <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              {getPerformanceMessage()}
            </p>
          </div>

          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 z-10">
            <div className="bg-blue-50/50 p-6 md:p-10 rounded-3xl border border-blue-100 text-center shadow-sm">
              <p className="text-5xl font-black text-blue-600 tracking-tighter mb-2">{result.totalScore}</p>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Score</p>
            </div>
            <div className="bg-emerald-50/50 p-6 md:p-10 rounded-3xl border border-emerald-100 text-center shadow-sm">
              <p className="text-5xl font-black text-emerald-500 tracking-tighter mb-2">{accuracy}%</p>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Accuracy</p>
            </div>
            <div className="bg-slate-50 p-6 md:p-10 rounded-3xl border border-slate-200 text-center shadow-sm">
              <p className="text-4xl font-black text-slate-600 tracking-tighter mb-2">Top 12%</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentile</p>
            </div>
          </div>
        </motion.div>

        {/* Category breakdown row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16 md:mb-24">
          {scores.map(([cat, score]) => {
            const max = cat === 'CS' ? 50 : cat === 'GK' ? 5 : cat === 'English' ? 10 : cat === 'Maths' ? 25 : 20;
            return (
              <div key={cat} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{cat}</span>
                <span className="text-xl font-black text-slate-900">{score}/{max}</span>
              </div>
            );
          })}
        </div>

                {/* Scroll Indicator Card */}
        <div className="mb-16">
          <div className="bg-slate-900 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-600/20 transition-colors" />
            <div className="flex items-center gap-6 z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 animate-bounce">
                <ArrowRight className="text-white w-8 h-8 rotate-90" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-black text-white mb-1 tracking-tight">Ready for a deeper look?</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm">Scroll down to review your answers</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-slate-500 font-black text-sm uppercase tracking-tighter opacity-50">
              <span>Detailed Breakdown</span>
              <div className="w-12 h-[2px] bg-slate-800" />
              <span>Performance Review</span>
            </div>
          </div>
        </div>


        {/* 2. PERFORMANCE INSIGHT SECTION */}
        <div className="mb-16 md:mb-24">
          <div className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center border border-amber-100 shrink-0">
               <TrendingUp className="text-amber-500 w-10 h-10" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Performance Insight</h3>
              <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
                Your <span className="text-blue-600 font-bold">{weakCategory}</span> score is low. Improving this can significantly boost your overall percentile and rank.
              </p>
            </div>
          </div>
        </div>

        {/* 3. COURSE PROMOTION SECTION */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full mb-6 border border-blue-100 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">LBS Foundation Excellence</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Improve Your Weak Areas with Our Course</h2>
            <p className="text-xl md:text-2xl text-slate-700 font-bold max-w-3xl mx-auto leading-relaxed">
              Students of <span className="text-blue-600 font-black underline decoration-blue-200 underline-offset-4">Computer Applications</span> at the <span className="text-blue-600 font-black underline decoration-blue-200 underline-offset-4">College of Engineering Trivandrum</span> introduce an LBS MCA Crash Course designed to help you prepare effectively at an affordable price of just <span className="text-emerald-600 font-black text-3xl md:text-4xl px-2 py-1 bg-emerald-50 rounded-lg inline-block rotate-2 shadow-sm border border-emerald-100">₹350</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {VIDEOS.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                activeVideoId={activeVideoId}
                setActiveVideoId={setActiveVideoId}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <a href="https://lbscourse.cetmca.in/" target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-green-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/30 hover:bg-green-700 transition-all hover:-translate-y-1 active:translate-y-0 inline-block">
               JOIN NOW JUST FOR ₹350 <ArrowRight className="inline-block ml-2 w-5 h-5" />
             </a>
          </div>
        </div>


        {/* 5. DETAILED RESULT SECTION */}
        <div className="mb-16 md:mb-24 pt-16 border-t border-slate-200">
           <div className="flex items-center gap-6 mb-12">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-wider shrink-0">Detailed Analysis</h2>
            <div className="h-[2px] bg-slate-200 flex-1" />
          </div>

          <div className="space-y-6">
            {allQuestions.map((q, idx) => {
              const userAnswer = result.answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              const isSkipped = userAnswer === undefined;

              return (
                <div key={q.id} className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-black ${
                      isCorrect ? 'bg-emerald-100 text-emerald-600' : isSkipped ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{q.category}</span>
                        {isCorrect && <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full"><Check className="w-3 h-3" /> CORRECT</span>}
                        {!isCorrect && !isSkipped && <span className="flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full"><X className="w-3 h-3" /> INCORRECT</span>}
                        {isSkipped && <span className="flex items-center gap-1 text-[10px] font-black text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full"><Minus className="w-3 h-3" /> SKIPPED</span>}
                      </div>
                      <h4 className="text-base md:text-lg font-bold text-slate-800 leading-snug">{q.question}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                    {q.options.map((option, optIdx) => {
                      const isCorrectOpt = optIdx === q.correctAnswer;
                      const isSelectedOpt = optIdx === userAnswer;
                      
                      return (
                        <div 
                          key={optIdx} 
                          className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                            isCorrectOpt ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                            isSelectedOpt ? 'bg-red-50 border-red-200 text-red-900' :
                            'bg-slate-50 border-slate-100 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                             <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black border ${
                               isCorrectOpt ? 'bg-emerald-500 border-emerald-500 text-white' :
                               isSelectedOpt ? 'bg-red-500 border-red-500 text-white' :
                               'bg-white border-slate-200 text-slate-400'
                             }`}>
                               {String.fromCharCode(65 + optIdx)}
                             </div>
                             {option}
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

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 sticky bottom-8 z-50">
          <button onClick={onReset} className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border-2 border-slate-200 bg-white/90 backdrop-blur text-slate-600 font-black hover:bg-slate-50 transition-all shadow-xl active:scale-[0.98]">
            <RefreshCw size={20} /> RETAKE TEST
          </button>
          <a href="https://lbscourse.cetmca.in/" target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-green-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/30 hover:bg-green-700 transition-all hover:-translate-y-1 active:translate-y-0 inline-block">
            GET COURSE ACCESS <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
