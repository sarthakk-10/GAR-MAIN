import { useEffect, useState } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { RefreshCcw, Skull, Award, Shield, Zap, History } from 'lucide-react';
import Leaderboard from '../components/Leaderboard';
import bgImage from '../assets/bg.png';

function CountUpStat({ value, suffix = '', decimals = 0, className = '' }) {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2, // Count up in exactly 1.2s
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => setDisplayValue(latest)
    });

    return () => controls.stop();
  }, [motionValue, value]);

  return <span className={className}>{displayValue.toFixed(decimals)}{suffix}</span>;
}

export default function ResultScreen({
  playerLives,
  stats,
  leaderboardScores,
  onClearLeaderboard,
  onRestart,
  onOpenHistory,
  botName
}) {
  const isVictory = playerLives > 0;
  
  const accuracy = stats.totalQuestionsAnswered > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100) 
    : 0;

  return (
    <div className="w-full h-screen overflow-y-auto relative select-none font-sans text-white">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(${bgImage})` }} 
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 z-0" style={{ backgroundColor: 'rgba(0,0,0,0.72)' }} />

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 py-12 flex flex-col justify-center min-h-[90vh]">
        {/* Result Headline Banner */}
        <div className="text-center mb-10 space-y-3 relative">
          <motion.h1
            className="text-6xl md:text-8xl font-black leading-none uppercase tracking-wider mb-2 text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {isVictory ? "MISSION COMPLETE" : "KIA"}
          </motion.h1>

          <p className="text-[14px] text-[#a8a29e] max-w-md mx-auto leading-relaxed pt-1">
            {isVictory 
              ? `Excellent performance. You've outpaced ${botName} algorithms and survived the barrel.` 
              : `Recall deficiency detected. ${botName} outperformed you in cognitive memory or pure luck.`}
          </p>
        </div>

        {/* Grid: Stats Summary & Leaderboard */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          
          {/* Left Column: Debrief Stats */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              className="p-6 space-y-6 rounded-[12px] shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: 'rgba(0,0,0,0.65)',
                border: '1px solid rgba(245,158,11,0.2)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            >
              <h3 className="text-[14px] font-bold text-[#f59e0b] border-b border-[rgba(245,158,11,0.2)] pb-3 uppercase tracking-wider">
                MISSION DEBRIEF
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Accuracy Stat */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(245,158,11,0.15)] rounded-[8px] p-4 flex flex-col justify-between hover:bg-[rgba(245,158,11,0.05)] transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold text-[#a8a29e] tracking-[2px] uppercase">ACCURACY INDEX</span>
                    <Award className="w-4 h-4 text-[#f59e0b]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#f59e0b]">
                      <CountUpStat value={accuracy} suffix="%" />
                    </p>
                    <p className="text-[10px] text-[#a8a29e] mt-1 font-semibold uppercase">
                      <CountUpStat value={stats.correctAnswers} /> / <CountUpStat value={stats.totalQuestionsAnswered} /> CORRECT
                    </p>
                  </div>
                </div>

                {/* Rounds Survived */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(245,158,11,0.15)] rounded-[8px] p-4 flex flex-col justify-between hover:bg-[rgba(245,158,11,0.05)] transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold text-[#a8a29e] tracking-[2px] uppercase">ROUNDS SURVIVED</span>
                    <Zap className="w-4 h-4 text-[#f59e0b]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#f59e0b]">
                      <CountUpStat value={stats.roundsSurvived} />
                    </p>
                    <p className="text-[10px] text-[#a8a29e] mt-1 font-semibold uppercase">
                      TOTAL DECISION ROUNDS
                    </p>
                  </div>
                </div>

                {/* Clicks Pulled */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(245,158,11,0.15)] rounded-[8px] p-4 flex flex-col justify-between hover:bg-[rgba(245,158,11,0.05)] transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold text-[#a8a29e] tracking-[2px] uppercase">TRIGGER PULLS</span>
                    <Shield className="w-4 h-4 text-[#f59e0b]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#f59e0b]">
                      <CountUpStat value={stats.shotsSurvived} />
                    </p>
                    <p className="text-[10px] text-[#a8a29e] mt-1 font-semibold uppercase">
                      SAFE VACANT CHAMBERS
                    </p>
                  </div>
                </div>

                {/* Peak Risk faced */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(245,158,11,0.15)] rounded-[8px] p-4 flex flex-col justify-between hover:bg-[rgba(245,158,11,0.05)] transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold text-[#a8a29e] tracking-[2px] uppercase">MAX RISK SURVIVED</span>
                    <Skull className="w-4 h-4 text-[#ef4444]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#f59e0b]">
                      <CountUpStat value={stats.maxProbabilitySurvived} suffix="%" />
                    </p>
                    <p className="text-[10px] text-[#a8a29e] mt-1 font-semibold uppercase">
                      HIGHEST BULLET CHANCE
                    </p>
                  </div>
                </div>

              </div>

              {/* Verdict summary */}
              <div className="border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.05)] p-4 rounded-[8px] text-[12px] text-[#a8a29e] leading-relaxed">
                <span className="text-[#f59e0b] font-bold block mb-1 uppercase tracking-widest text-[10px]">OPERATIVE VERDICT</span>
                {isVictory ? (
                  <span>
                    Cognitive recall capacity is exceptionally high. Student demonstrates supreme recall performance under threat stress. Ready for final exams.
                  </span>
                ) : (
                  <span>
                    Revision failure recorded in field. Operative failed to survive round {stats.roundsSurvived}. Recommend immediate study refresh and recalibration.
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={onRestart}
                  className="w-full h-[48px] rounded-[8px] bg-[#f59e0b] text-[#000000] font-[700] text-[13px] tracking-[2px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 hover:bg-[#d97706] hover:scale-[1.01]"
                >
                  <RefreshCcw className="w-4 h-4 stroke-[2.5]" />
                  PLAY AGAIN
                </button>
                <button
                  onClick={onOpenHistory}
                  className="w-full h-[48px] rounded-[8px] bg-transparent border border-[rgba(255,255,255,0.1)] text-[#a8a29e] font-[700] text-[13px] tracking-[2px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 hover:border-[#f59e0b] hover:text-[#f59e0b]"
                >
                  <History className="w-4 h-4" />
                  SCORE HISTORY
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Scoreboard */}
          <motion.div
            className="lg:col-span-6 w-full h-full"
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            <Leaderboard scores={leaderboardScores} onClear={onClearLeaderboard} theme="home" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
