import { useEffect, useState } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { RefreshCcw, Skull, Award, Shield, Zap, History, TrendingUp, TrendingDown, Minus, Clock, Target, BrainCircuit, Activity } from 'lucide-react';
import Leaderboard from '../components/Leaderboard';
import bgImage from '../assets/bg.png';

function CountUpStat({ value, suffix = '', decimals = 0, className = '' }) {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => setDisplayValue(latest)
    });

    return () => controls.stop();
  }, [motionValue, value]);

  return <span className={className}>{displayValue.toFixed(decimals)}{suffix}</span>;
}

function generateDetailedVerdict(stats) {
  const { accuracy, roundsSurvived, stressScore, trend } = stats;
  
  let verdict = '';
  
  if (accuracy >= 80) {
    verdict += 'Exceptional recall under pressure. ';
  } else if (accuracy >= 60) {
    verdict += 'Strong fundamentals with room for improvement. ';
  } else {
    verdict += 'Struggled with high-pressure scenarios. ';
  }
  
  if (trend === 'improving') {
    verdict += 'Performance improved as rounds progressed. ';
  } else if (trend === 'declining') {
    verdict += 'Mental fatigue evident in later rounds. ';
  } else {
    verdict += 'Consistent cognitive performance maintained. ';
  }
  
  if (stressScore > 75) {
    verdict += 'Demonstrates excellent stress management. ';
  } else if (stressScore < 50) {
    verdict += 'Consider stress management techniques. ';
  }
  
  if (roundsSurvived > 4) {
    verdict += 'Prepared for high-difficulty scenarios.';
  }
  
  return verdict;
}

export default function ResultScreen({
  playerLives,
  botLives,
  roundNumber,
  stats,
  leaderboardScores,
  onClearLeaderboard,
  onRestart,
  onOpenHistory,
  botName
}) {
  const isVictory = playerLives > 0;
  const reachedMax = playerLives > 0 && botLives > 0;
  
  const {
    accuracy = 0,
    roundByRound = [],
    trend = 'flat',
    stressScore = 0,
    lowRiskAcc = 0,
    highRiskAcc = 0,
    highestRiskFaced = 0,
    avgResponseTimeMs = 0
  } = stats;

  const getGameEndMessage = () => {
    if (reachedMax) return 'GAME REACHED MAXIMUM DIFFICULTY (ROUND 6 SURVIVED)';
    if (playerLives <= 0) return `YOU SURVIVED ${stats.roundsSurvived} ROUNDS BEFORE ELIMINATION`;
    if (botLives <= 0) return `${botName} ELIMINATED AT ROUND ${stats.roundsSurvived}`;
    return 'UNKNOWN STATUS';
  };

  const getAccuracyColor = (acc) => {
    if (acc >= 80) return 'text-[#22c55e]';
    if (acc >= 60) return 'text-[#f59e0b]';
    return 'text-[#ef4444]';
  };

  const getTrendIcon = (t) => {
    if (t === 'improving') return <span className="text-[#22c55e] flex items-center gap-1"><TrendingUp className="w-4 h-4" /> IMPROVING</span>;
    if (t === 'declining') return <span className="text-[#ef4444] flex items-center gap-1"><TrendingDown className="w-4 h-4" /> DECLINING</span>;
    return <span className="text-[#a8a29e] flex items-center gap-1"><Minus className="w-4 h-4" /> CONSISTENT</span>;
  };

  // Compare to history
  const pastScores = leaderboardScores.filter(s => s.id !== Date.now().toString()); // Exclude current from past (rough heuristic)
  const pastAccuracies = pastScores.map(s => s.accuracy);
  pastAccuracies.sort((a, b) => a - b);
  
  let percentile = 0;
  if (pastAccuracies.length > 0) {
    const worseCount = pastAccuracies.filter(a => a < accuracy).length;
    percentile = Math.round((worseCount / pastAccuracies.length) * 100);
  }

  const personalBest = pastAccuracies.length > 0 ? Math.max(...pastAccuracies) : 0;
  const isPersonalBest = accuracy > 0 && accuracy >= personalBest;

  return (
    <div className="w-full h-screen overflow-y-auto relative select-none font-sans text-white pb-12">
      {/* Background Image */}
      <div className="fixed inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.75)] to-[rgba(0,0,0,0.92)]" />

      <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 pt-24 pb-12 flex flex-col items-center">
        
        {/* Section 1: Outcome Headline */}
        <div className="text-center mb-10 space-y-3 relative w-full">
          <motion.h1
            className="text-6xl md:text-7xl font-black leading-none uppercase tracking-wider mb-2 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {isVictory ? "MISSION COMPLETE" : "KIA"}
          </motion.h1>
          <p className="text-[14px] text-[#f59e0b] max-w-lg mx-auto leading-relaxed pt-1 uppercase font-bold tracking-widest bg-[rgba(245,158,11,0.1)] border border-[#f59e0b]/30 py-2 rounded">
            {getGameEndMessage()}
          </p>
        </div>

        {/* Section 2: Layout Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Panel: Core Metrics */}
          <motion.div
            className="bg-[rgba(10,8,5,0.85)] border border-[rgba(245,158,11,0.2)] rounded-[12px] p-6 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-[12px] font-bold text-[#f59e0b] border-b border-[rgba(245,158,11,0.2)] pb-2 mb-4 uppercase tracking-[2px]">Core Metrics</h3>
            
            <div className="space-y-4">
              {/* Accuracy */}
              <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-3 rounded">
                <div>
                  <div className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase">Accuracy Index</div>
                  <div className="text-[13px] text-white mt-1">{stats.correctAnswers}/{stats.totalQuestionsAnswered} Correct</div>
                </div>
                <div className={`text-3xl font-black ${getAccuracyColor(accuracy)}`}>
                  <CountUpStat value={accuracy} suffix="%" />
                </div>
              </div>

              {/* Trend */}
              <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-3 rounded">
                <div className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase">Performance Trend</div>
                <div className="text-[14px] font-bold">{getTrendIcon(trend)}</div>
              </div>

              {/* Rounds Survived */}
              <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-3 rounded">
                <div className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase">Rounds Survived</div>
                <div className="text-[18px] font-bold text-white">{stats.roundsSurvived} <span className="text-[#57534e] text-sm">of 6</span></div>
              </div>

              {/* Highest Risk */}
              <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-3 rounded">
                <div className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase">Highest Risk Faced</div>
                <div className="text-[18px] font-bold text-[#ef4444]">{Math.round(highestRiskFaced)}%</div>
              </div>

              {/* Response Time */}
              <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-3 rounded">
                <div className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase">Questions Answered</div>
                <div className="text-right">
                  <div className="text-[16px] font-bold text-white">{stats.totalQuestionsAnswered} Total</div>
                  <div className="text-[11px] text-[#a8a29e]">Avg time: {(avgResponseTimeMs / 1000).toFixed(1)}s/Q</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel: Stress & Learning */}
          <motion.div
            className="bg-[rgba(10,8,5,0.85)] border border-[rgba(245,158,11,0.2)] rounded-[12px] p-6 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-[12px] font-bold text-[#f59e0b] border-b border-[rgba(245,158,11,0.2)] pb-2 mb-4 uppercase tracking-[2px]">Analysis</h3>

            {/* Stress Resilience */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase">Stress Resilience Score</div>
                <div className="text-[32px] font-black text-white leading-none mt-1"><CountUpStat value={stressScore} />/100</div>
              </div>
              <BrainCircuit className="w-10 h-10 text-[#f59e0b] opacity-50" />
            </div>

            {/* Accuracy Under Pressure */}
            <div className="mb-6">
              <div className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase mb-2">Accuracy Under Pressure</div>
              <div className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#a8a29e]">Low Risk (&lt;50%)</span>
                  <span className={`font-bold ${getAccuracyColor(lowRiskAcc)}`}>{Math.round(lowRiskAcc)}%</span>
                </div>
                <div className="w-full bg-[#1c1917] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#22c55e] h-full" style={{ width: `${lowRiskAcc}%` }} />
                </div>
                
                <div className="flex justify-between text-[13px] pt-1">
                  <span className="text-[#a8a29e]">High Risk (&ge;50%)</span>
                  <span className={`font-bold ${getAccuracyColor(highRiskAcc)}`}>{Math.round(highRiskAcc)}%</span>
                </div>
                <div className="w-full bg-[#1c1917] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#ef4444] h-full" style={{ width: `${highRiskAcc}%` }} />
                </div>
              </div>
            </div>

            {/* Learning Curve Mini Chart */}
            <div>
              <div className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase mb-3 flex justify-between">
                <span>Learning Curve</span>
                {getTrendIcon(trend)}
              </div>
              <div className="space-y-2">
                {roundByRound.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 text-[12px]">
                    <span className="text-[#a8a29e] w-16">Round {r.round}</span>
                    <div className="flex-1 bg-[#1c1917] h-[6px] rounded-full overflow-hidden flex items-center">
                      <div className={`h-full ${r.accuracy >= 80 ? 'bg-[#22c55e]' : r.accuracy >= 60 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`} style={{ width: `${r.accuracy}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold">{Math.round(r.accuracy)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom Full Width: AI Verdict & Actionable Insights */}
          <motion.div
            className="lg:col-span-2 bg-[rgba(10,8,5,0.85)] border border-[rgba(245,158,11,0.2)] rounded-[12px] p-6 shadow-xl flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* AI Verdict */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-[rgba(245,158,11,0.2)] pb-6 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-[#f59e0b] font-bold uppercase tracking-widest text-[10px]">AI-Generated Verdict</span>
              </div>
              <p className="text-[14px] text-[#e7e5e4] leading-relaxed">
                {generateDetailedVerdict(stats)}
              </p>
            </div>

            {/* Actionable Insights */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-[#f59e0b] font-bold uppercase tracking-widest text-[10px]">Actionable Insights</span>
              </div>
              <ul className="space-y-2 text-[13px] text-[#a8a29e]">
                {trend === 'declining' && <li>• Accuracy declined in later rounds - practice maintaining focus under fatigue.</li>}
                {lowRiskAcc > highRiskAcc + 15 && <li>• Performance dropped significantly at high risk levels. Practice under simulated time pressure.</li>}
                {highRiskAcc > lowRiskAcc && <li>• You performed better under high pressure. Maintain this focus consistently.</li>}
                {avgResponseTimeMs > 15000 && <li>• Average response time ({(avgResponseTimeMs/1000).toFixed(1)}s) is slow. Focus on faster decision-making.</li>}
                {accuracy < 60 && <li>• Overall recall is weak. Recommend reviewing core concepts before playing again.</li>}
                {accuracy >= 80 && avgResponseTimeMs <= 10000 && <li>• Outstanding speed and accuracy. Try increasing the difficulty level.</li>}
                {isPersonalBest && <li>• 🌟 New Personal Best Accuracy!</li>}
                {pastScores.length > 0 && !isPersonalBest && <li>• Better than {percentile}% of your previous sessions.</li>}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div 
          className="w-full max-w-[500px] mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onRestart}
            className="w-full h-[48px] rounded-[8px] bg-[#f59e0b] text-[#000000] font-[700] text-[13px] tracking-[2px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 hover:bg-[#d97706] hover:scale-[1.02]"
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
        </motion.div>

        {/* Leaderboard Section (Moved below breakdown) */}
        <motion.div
          className="w-full mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(245,158,11,0.3)] to-transparent mb-12" />
          <Leaderboard scores={leaderboardScores} onClear={onClearLeaderboard} theme="home" />
        </motion.div>

      </div>
    </div>
  );
}
