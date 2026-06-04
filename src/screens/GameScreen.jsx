import { useEffect, useState } from 'react';
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion';
import { Skull, Heart, Target } from 'lucide-react';
import Cylinder from '../components/Cylinder';
import HeartbeatLine from '../components/HeartbeatLine';
import bgImage from '../assets/bg.png';

function AnimatedReadout({ value, className = '', suffix = '%' }) {
  const motionValue = useMotionValue(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.42,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [motionValue, value]);

  return <span className={className}>{displayValue.toFixed(0)}{suffix}</span>;
}

export default function GameScreen({
  playerName,
  difficulty,
  question,
  questionIndex,
  totalQuestions,
  roundNumber,
  playerLives,
  botLives,
  currentChamber,
  spentChambers,
  bulletFired,
  probability,
  turn,
  isSpinning,
  botMessage,
  isBotThinking,
  onAnswer,
  onShoot,
  gameState,
  selectedAnswer,
  shootTarget,
  overlayType,
  soundEnabled,
  onToggleSound,
  botName = 'WARDEN'
}) {
  const playerHit = overlayType === 'bang' && (shootTarget === 'player' || shootTarget === 'self');
  const botHit = overlayType === 'bang' && shootTarget === 'bot';
  const isClick = overlayType === 'click';
  
  const isCorrect = gameState !== 'answering' && selectedAnswer === question.correctAnswer;
  const isWrong = gameState !== 'answering' && selectedAnswer && selectedAnswer !== question.correctAnswer;

  const handleOptionClick = (optionKey) => {
    if (gameState !== 'answering') return;
    onAnswer(optionKey);
  };

  const renderPlayerLives = () => {
    return (
      <div className="flex gap-2 items-center h-full">
        <span className="text-[10px] text-[#f59e0b] font-bold tracking-widest mr-2 uppercase">PLAYER_HP:</span>
        <HeartbeatLine riskLevel={probability} className="w-[60px] mr-2" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart 
            key={i} 
            className={`w-5 h-5 ${i < playerLives ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#2a2a2a] fill-[#2a2a2a]'}`} 
          />
        ))}
      </div>
    );
  };

  const renderBotLives = () => {
    return (
      <div className="flex gap-1 items-center mt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skull 
            key={i} 
            className={`w-5 h-5 ${i < botLives ? 'text-[#f59e0b]' : 'text-[#2a2a2a]'}`} 
          />
        ))}
      </div>
    );
  };

  const isBotShootingPlayer = overlayType === 'bang' && shootTarget === 'player';
  const isPlayerShootingBotBang = overlayType === 'bang' && shootTarget === 'bot';
  const isPlayerShootingBotClick = overlayType === 'click' && shootTarget === 'bot';
  const isPlayerShootingSelf = (overlayType === 'bang' || overlayType === 'click') && shootTarget === 'self';

  // Determine Background Overlay Color
  let overlayColor = 'bg-black/72';
  if (gameState === 'shooting_choice') overlayColor = 'bg-[rgba(245,158,11,0.15)]';
  if (playerHit) overlayColor = 'bg-[rgba(180,0,0,0.6)]';
  if (botHit) overlayColor = 'bg-[rgba(245,158,11,0.4)]';

  return (
    <div className="w-full h-screen overflow-hidden relative select-none font-sans bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(${bgImage})` }} 
      />
      
      {/* Dynamic Overlay */}
      <motion.div 
        className={`absolute inset-0 z-10 transition-colors duration-300 ${overlayColor}`} 
        animate={playerHit || botHit ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
        transition={{ duration: 0.1, repeat: (playerHit || botHit) ? 5 : 0 }}
      />

      {/* Bot Shoot Flash Overlay */}
      <AnimatePresence>
        {isBotShootingPlayer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, times: [0, 0.2, 1] }}
              className="absolute inset-0 bg-[rgba(200,0,0,0.3)] z-[12] pointer-events-none"
            />
            {/* Centered Muzzle Flash Explosion */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 3.0, 1.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(245,158,11,0.9)_30%,rgba(239,68,68,0.5)_60%,rgba(0,0,0,0)_80%)] z-[50] blur-[8px] pointer-events-none mix-blend-screen"
            />
          </>
        )}
      </AnimatePresence>

      {/* Click (Dry Fire) Flash Overlay */}
      <AnimatePresence>
        {isClick && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-[rgba(255,255,255,0.15)] z-[15] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main 3-Column Content Container */}
      <motion.div 
        className="relative z-20 w-full h-full flex flex-row px-8 pt-24 pb-8 gap-8 items-stretch"
        animate={
          isBotShootingPlayer ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : 
          isClick ? { scale: [1, 0.99, 1] } : 
          { x: 0, scale: 1 }
        }
        transition={{ duration: isClick ? 0.2 : 0.35 }}
      >

        {/* Absolute Top Elements */}
        {/* Top Center Banner */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center w-full max-w-xl z-40">
          <div className={`px-8 py-3 rounded-[8px] border backdrop-blur-sm transition-colors ${
            gameState === 'answering' ? 'border-[#f59e0b]/35 bg-[rgba(0,0,0,0.75)] text-white' :
            isCorrect ? 'border-[#22c55e] bg-[rgba(0,0,0,0.75)] text-[#22c55e]' :
            isWrong ? 'border-[#ef4444] bg-[rgba(0,0,0,0.75)] text-[#ef4444]' :
            'border-zinc-500 bg-[rgba(0,0,0,0.75)] text-zinc-400'
          }`}>
            <h2 className="text-[14px] font-bold tracking-[2px] uppercase text-center">
              {gameState === 'answering' ? 'YOUR TURN — ANSWER THE QUESTION' :
               isCorrect && gameState === 'shooting_choice' ? 'ANSWER CORRECT — CHOOSE YOUR TARGET' :
               isWrong ? `INCORRECT — ${botName} HAS THE GUN` :
               (playerHit || botHit) ? 'BANG — DAMAGE DEALT' :
               isClick ? 'CLICK — SAFE' : 'AWAITING RESPONSE'}
            </h2>
          </div>
        </div>

        {/* Player Stats (Top Right) */}
        <div className="absolute top-6 right-8 flex gap-3 items-stretch z-40 h-10">
          <div className="flex flex-col items-end justify-center mr-4">
            <span className="text-[10px] text-[#f59e0b] tracking-widest font-bold">ROUND <span className="text-[#f59e0b] font-bold leading-none text-sm">{roundNumber}</span></span>
          </div>
          {renderPlayerLives()}
        </div>

        {/* LEFT COLUMN: Opponent Dashboard */}
        <div className="w-[20%] min-w-[280px] max-w-[320px] flex-shrink-0 flex flex-col justify-start z-30">
          <div className="bg-[rgba(0,0,0,0.65)] border border-[rgba(245,158,11,0.2)] p-5 rounded-[12px] w-full relative h-auto">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 border-b border-[rgba(245,158,11,0.2)] pb-2">
                <span className="text-[#f59e0b] text-[10px] font-bold tracking-[2px] uppercase">OPPONENT_SYS</span>
                <span className="text-[#f59e0b] border border-[#f59e0b] bg-transparent rounded-[4px] px-2 py-0.5 text-[10px] uppercase font-bold">Lvl: {difficulty}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center py-4 relative">
                <motion.div
                  animate={botHit ? { x: [0, 15, -15, 10, -10, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Skull className={`w-24 h-24 ${botHit ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`} />
                </motion.div>
                
                {/* Hit Marker on Bot Card */}
                <AnimatePresence>
                  {isPlayerShootingBotBang && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 flex items-center justify-center z-20 text-[#ef4444] text-8xl font-black drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] pointer-events-none"
                    >
                      ✕
                    </motion.div>
                  )}
                </AnimatePresence>

                <HeartbeatLine riskLevel={probability} className="mt-2 w-[80%] max-w-[120px]" />
                
                <h3 className="text-white font-bold tracking-widest text-lg mt-2">{botName}</h3>
                {turn === 'bot' && (
                  <span className="text-[#ef4444] text-[10px] uppercase animate-pulse mt-1 font-bold">ARMED</span>
                )}
              </div>

              <div className="mt-4 border-t border-[rgba(245,158,11,0.2)] pt-3">
                <span className="text-[#a8a29e] text-[10px] uppercase font-bold tracking-widest">SYSTEM INTEGRITY</span>
                {renderBotLives()}
              </div>

              {/* Bot Message Box */}
              {botMessage && (
                <div className="mt-6 bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] p-3 text-[12px] text-[#a8a29e] font-mono break-words leading-relaxed rounded-[8px]">
                  &gt; {botMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Bot Image & Chamber Panel */}
        <div className="flex-1 relative flex flex-col justify-end items-center z-20">
          
          {/* Bot Target Area (for hit markers and flashes) */}
          <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 w-[240px] md:w-[280px] pointer-events-none flex flex-col items-center justify-end z-10">
            {/* Center column empty anchor point */}
          </div>

          {/* Center Shoot Choice */}
          <AnimatePresence>
            {gameState === 'shooting_choice' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12 z-40"
              >
                <button
                  onClick={() => onShoot('self')}
                  className="group relative flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.5)] rounded-[8px] hover:brightness-120 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <Skull className="w-8 h-8 md:w-10 md:h-10 text-[#ef4444] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[#ef4444] font-bold text-[10px] md:text-xs tracking-widest text-center leading-tight">SHOOT<br/>SELF</span>
                  </div>
                </button>

                <button
                  onClick={() => onShoot('bot')}
                  className="group relative flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.5)] rounded-[8px] hover:brightness-120 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <Target className="w-8 h-8 md:w-10 md:h-10 text-[#f59e0b] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[#f59e0b] font-bold text-[10px] md:text-xs tracking-widest text-center leading-tight">SHOOT<br/>OPPONENT</span>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chamber Panel */}
          <div className="w-full max-w-[600px] z-30 mx-auto">
            <Cylinder
              currentChamber={currentChamber}
              spentChambers={spentChambers}
              isSpinning={isSpinning}
              bulletFired={bulletFired}
              probability={probability}
            />
          </div>

        </div>

        {/* RIGHT COLUMN: Query Terminal */}
        <div className="w-[20%] min-w-[280px] max-w-[320px] flex-shrink-0 flex flex-col justify-start z-30">
          <div className="bg-[rgba(0,0,0,0.65)] border border-[rgba(245,158,11,0.2)] p-5 rounded-[12px] w-full max-h-full overflow-y-auto relative">
            <div className="relative z-10 text-white">
              <div className="text-[10px] uppercase tracking-[2px] border-b border-[rgba(245,158,11,0.2)] pb-2 mb-4 flex justify-between text-[#f59e0b] font-bold">
                <span>QUERY TERMINAL</span>
                <span>{questionIndex + 1}/{totalQuestions}</span>
              </div>

              <p className="text-[14px] font-normal leading-relaxed mb-6">
                {question.question}
              </p>

              <div className="space-y-3">
                {Object.entries(question.options).map(([key, text]) => {
                  const isThisSelected = selectedAnswer === key;
                  const isThisCorrect = question.correctAnswer === key;
                  const isCorrectRevealed = gameState !== 'answering' && isThisCorrect;
                  
                  let btnClass = "bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] text-white hover:bg-[rgba(245,158,11,0.12)] hover:border-[rgba(245,158,11,0.5)] hover:scale-[1.01]";
                  let letterColor = "text-[#f59e0b]";
                  
                  if (gameState !== 'answering') {
                    if (isCorrectRevealed) {
                      btnClass = "bg-[rgba(34,197,94,0.15)] border-[#22c55e] text-white";
                      letterColor = "text-white";
                    } else if (isThisSelected) {
                      btnClass = "bg-[rgba(239,68,68,0.15)] border-[#ef4444] text-white";
                      letterColor = "text-white";
                    } else {
                      btnClass = "bg-[rgba(245,158,11,0.02)] border border-[rgba(255,255,255,0.05)] text-[#a8a29e] opacity-50";
                      letterColor = "text-[#a8a29e]";
                    }
                  }

                  return (
                    <button
                      key={key}
                      disabled={gameState !== 'answering'}
                      onClick={() => handleOptionClick(key)}
                      className={`w-full text-left p-3 text-[13px] flex items-start gap-3 cursor-pointer rounded-[8px] transition-all duration-150 ease-in-out ${btnClass}`}
                    >
                      <span className={`font-bold shrink-0 ${letterColor}`}>{key}.</span>
                      <span>{text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
