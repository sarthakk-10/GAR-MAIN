import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';
import HistoryScreen from './screens/HistoryScreen';
import ApiKeyModal from './components/ApiKeyModal';
import { extractTextFromPdf } from './services/pdfParser';
import { generateQuestions } from './services/aiGenerator';
import logoImg from './assets/logo.png';

const SCORE_HISTORY_KEY = 'gamified_active_recall_scores';

// Dialogue messages database for dynamic bots
const BOT_TAUNTS = {
  CADET_7: {
    wrongAnswer: [
      "I... I think I can do this",
      "My circuits are warming up...",
      "Don't go easy on me!"
    ],
    idle: [
      "I'm ready when you are.",
      "Just select your answer, I guess.",
      "This is my first live fire exercise!"
    ],
    shootPlayerBang: [
      "I hit! I mean, system damage recorded.",
      "Wow, I actually hit!"
    ],
    shootPlayerBlank: [
      "Phew, you survived.",
      "It was a blank. Good luck!"
    ],
    shootSelfBlank: ["I survived! Wow."],
    shootSelfBang: ["Ouch! That really hurts!"],
    missedBot: ["You missed me! Okay, my turn!"]
  },
  WARDEN: {
    wrongAnswer: [
      "Protocol engaged.",
      "Your hesitation is noted.",
      "The cell is ready for you."
    ],
    idle: [
      "The chamber is waiting.",
      "State your answer.",
      "I am monitoring your performance."
    ],
    shootPlayerBang: [
      "Neutralized.",
      "Threat eliminated.",
      "Direct hit."
    ],
    shootPlayerBlank: [
      "Click. You get a temporary reprieve.",
      "Next question is yours."
    ],
    shootSelfBlank: ["Standard procedure. Proceed."],
    shootSelfBang: ["Minor damage sustained. Recalibrating."],
    missedBot: ["Your aim is substandard. My turn."]
  },
  CIPHER: {
    wrongAnswer: [
      "Predictable.",
      "I've already calculated your next mistake.",
      "Your recall is... adequate."
    ],
    idle: [
      "Every incorrect answer increases your chances of terminal shutdown.",
      "I'm keeping the barrel warm for you.",
      "Make your move."
    ],
    shootPlayerBang: [
      "Hahaha! The mathematical probability finally caught you!",
      "Exactly as simulated."
    ],
    shootPlayerBlank: [
      "A minor variable shift.",
      "It changes nothing."
    ],
    shootSelfBlank: ["Statistically probable."],
    shootSelfBang: ["Anomalous variable detected in chamber..."],
    missedBot: ["You failed to account for my evasive patterns."]
  }
};

export default function App() {
  // Screen Routing
  const [screen, setScreen] = useState('home'); // 'home', 'game', 'result', 'history'
  const [isGlitching, setIsGlitching] = useState(false);
  
  // Game Setup & Configuration
  const [playerName, setPlayerName] = useState('REVISER');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('active_recall_sound') !== 'off');

  // PDF Parser State
  const [pdfParsedText, setPdfParsedText] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  // Leaderboard score logs
  const [leaderboardScores, setLeaderboardScores] = useState(() => {
    try {
      const saved = localStorage.getItem(SCORE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Game Engine State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [playerLives, setPlayerLives] = useState(3);
  const [botLives, setBotLives] = useState(3);
  
  // Revolver Cylinder State
  const [bulletChamber, setBulletChamber] = useState(0); // 0-5
  const [currentChamber, setCurrentChamber] = useState(0); // 0-5
  const [spentChambers, setSpentChambers] = useState([]); // clicked indices
  const [isSpinning, setIsSpinning] = useState(false);
  const [bulletFired, setBulletFired] = useState(false);

  // Active Gameplay Phase
  const [gameState, setGameState] = useState('answering'); // 'answering', 'shooting_choice', 'outcome_overlay'
  const [turn, setTurn] = useState('player'); // 'player' (user turn), 'bot' (bot shooting player)
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct', 'incorrect'
  const [shootTarget, setShootTarget] = useState(null); // 'self', 'bot'
  const [overlayType, setOverlayType] = useState(null); // 'bang', 'click'
  
  // Bot Messaging / Action Simulation
  const botName = difficulty === 'Easy' ? 'CADET_7' : difficulty === 'Medium' ? 'WARDEN' : 'CIPHER';
  const [botMessage, setBotMessage] = useState("Load your gun, Candidate. Class is starting.");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameStartError, setGameStartError] = useState(null);
  const [isShotFired, setIsShotFired] = useState(false);
  
  const botThinkingTimerRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);
  const incorrectDelayTimerRef = useRef(null);
  const previousScreenRef = useRef(screen);
  const questionPoolRef = useRef([]);
  const poolIndexRef = useRef(0);

  useEffect(() => {
    if (previousScreenRef.current === screen) return undefined;

    setIsGlitching(true);
    previousScreenRef.current = screen;
    const glitchTimer = setTimeout(() => setIsGlitching(false), 320);

    return () => clearTimeout(glitchTimer);
  }, [screen]);

  const clearPendingTimers = () => {
    console.log("[SHOOT] Clearing all pending timers.");
    if (botThinkingTimerRef.current) {
      clearTimeout(botThinkingTimerRef.current);
      botThinkingTimerRef.current = null;
    }
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (incorrectDelayTimerRef.current) {
      clearTimeout(incorrectDelayTimerRef.current);
      incorrectDelayTimerRef.current = null;
    }
  };

  // Session Statistics Tracker
  const [stats, setStats] = useState({
    correctAnswers: 0,
    totalQuestionsAnswered: 0,
    shotsSurvived: 0,
    maxProbabilitySurvived: 0,
    roundsSurvived: 0
  });

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('active_recall_sound', next ? 'on' : 'off');
      return next;
    });
  };

  const handleClearLeaderboard = () => {
    localStorage.removeItem(SCORE_HISTORY_KEY);
    setLeaderboardScores([]);
  };

  const playShotSound = (type) => {
    if (!soundEnabled) return;

    try {
      let audioFile = '';
      
      if (type === 'bang') audioFile = '/bang.mp3';
      else if (type === 'click') audioFile = '/click.mp3';
      else if (type === 'ding') audioFile = '/ding.mp3';

      if (audioFile) {
        const audio = new Audio(audioFile);
        audio.volume = 1.0;
        audio.play().catch(e => console.warn('Audio play prevented by browser:', e));
      }
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  };

  // Calculates probability: 1 / remaining chambers
  const getProbability = () => {
    const totalRemaining = 6 - spentChambers.length;
    return totalRemaining > 0 ? (1 / totalRemaining) * 100 : 100;
  };

  // Initialize Game Session
  const handleStartGame = async () => {
    setIsSpinning(true);
    setIsGenerating(true);
    
    // Set random bullet chamber
    const randomBullet = Math.floor(Math.random() * 6);
    setBulletChamber(randomBullet);
    setCurrentChamber(0);
    setSpentChambers([]);
    setBulletFired(false);
    
    // Reset Counters
    setStats({
      correctAnswers: 0,
      totalQuestionsAnswered: 0,
      shotsSurvived: 0,
      maxProbabilitySurvived: 0,
      roundsSurvived: 0
    });
    setPlayerLives(3);
    setBotLives(3);
    setRoundNumber(1);
    setCurrentQuestionIndex(0);
    setTurn('player');
    setGameState('answering');
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setShootTarget(null);
    setOverlayType(null);
    setBotMessage(getRandomElement(BOT_TAUNTS[botName].idle));
    setGameStartError(null);
    setIsShotFired(false);

    try {
      const trimmedText = pdfParsedText?.trim() || "";
      console.log(`[START GAME] Checking PDF parsed text length: ${trimmedText.length}`);
      
      if (trimmedText.length < 100) {
        setGameStartError("Please upload a PDF or paste revision notes (minimum 100 characters) to generate questions!");
        setIsSpinning(false);
        setIsGenerating(false);
        return;
      }

      console.log(`[START GAME] Launching question generation from PDF content...`);
      const gameQsPool = await generateQuestions(trimmedText, apiKey);
      
      if (!gameQsPool || gameQsPool.length === 0) {
        throw new Error("No questions could be extracted or generated from your text. Make sure your PDF/notes contain readable text.");
      }

      console.log(`[START GAME] Successfully retrieved a pool of ${gameQsPool.length} questions from the PDF.`);
      
      const shuffleQuestions = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      const shuffledPool = shuffleQuestions(gameQsPool);
      questionPoolRef.current = shuffledPool;
      const selectedCount = Math.min(questionCount, shuffledPool.length);
      poolIndexRef.current = selectedCount;
      const finalQuestions = shuffledPool.slice(0, selectedCount);

      setQuestions(finalQuestions);

      let initialGreeting = getRandomElement(BOT_TAUNTS[botName].idle);
      if (shuffledPool.length < questionCount) {
        alert(`${shuffledPool.length} questions found in your PDF.`);
        initialGreeting = `${shuffledPool.length} questions found in your PDF. ${initialGreeting}`;
      }
      setBotMessage(initialGreeting);

      setIsSpinning(false);
      setIsGenerating(false);
      setScreen('game');
    } catch (error) {
      console.error("[START GAME] Question Generation Failed:", error);
      setGameStartError(`Question Generation Failed: ${error.message}`);
      setIsSpinning(false);
      setIsGenerating(false);
    }
  };

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const reloadGun = () => {
    const randomBullet = Math.floor(Math.random() * 6);
    setBulletChamber(randomBullet);
    setCurrentChamber(0);
    setSpentChambers([]);
    setBulletFired(false);
    setRoundNumber(r => r + 1);
  };

  // Bot Auto-Shoot Hook (fires when turn becomes 'bot')
  useEffect(() => {
    if (screen !== 'game' || turn !== 'bot' || gameState !== 'outcome_overlay') return;

    // Simulate BOT_X cocking gun and aiming with a delay
    setIsBotThinking(true);
    const thinkDelay = 1800 + Math.random() * 1200; // 1.8s - 3.0s

    botThinkingTimerRef.current = setTimeout(() => {
      setIsBotThinking(false);
      
      // Bot pulls trigger on Player
      shoot('bot', 'player');
    }, thinkDelay);

    return () => {
      if (botThinkingTimerRef.current) clearTimeout(botThinkingTimerRef.current);
    };
  }, [screen, turn, gameState]);

  // Auto-Advance Game Hook after a Shot Outcome resolves
  useEffect(() => {
    if (screen !== 'game' || gameState !== 'outcome_overlay' || overlayType === null) return;

    const delay = overlayType === 'bang' ? 2400 : 1800; // 2.4s for damage flash, 1.8s for clicks
    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNextQuestion();
    }, delay);

    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [screen, gameState, overlayType, currentChamber, bulletFired, shootTarget, turn, playerLives, botLives]);

  // Player Answer Event Handler
  const handlePlayerAnswer = (optionKey) => {
    if (gameState !== 'answering') return;

    setSelectedAnswer(optionKey);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionKey === currentQuestion.correctAnswer;
    
    setStats(prev => ({
      ...prev,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
    }));

    if (isCorrect) {
      setAnswerStatus('correct');
      setGameState('shooting_choice');
      playShotSound('ding');
    } else {
      setAnswerStatus('incorrect');
      
      // INCORRECT -> Turn passes to BOT_X. BOT_X mocks player, then takes the gun to shoot them.
      setTurn('bot');
      setBotMessage(getRandomElement(BOT_TAUNTS[botName].wrongAnswer));
      
      // Delay outcome overlay reveal slightly to show red incorrect option color
      incorrectDelayTimerRef.current = setTimeout(() => {
        setShootTarget('player');
        setGameState('outcome_overlay');
      }, 1000);
    }
  };

  // Firing Mechanism Trigger Pull
  const shoot = (shooter, target) => {
    // Check if a shot has already been fired in this round
    if (isShotFired) {
      console.log(`[SHOOT BLOCKED] Shot already fired this round. Shooter: ${shooter}, Target: ${target}`);
      return;
    }

    setIsShotFired(true);
    clearPendingTimers(); // Clear all timeouts immediately on any shoot action
    console.log(`[SHOOT] ${shooter.toUpperCase()} fires at ${target.toUpperCase()}. Current Chamber: ${currentChamber}, Bullet Chamber: ${bulletChamber}`);

    setShootTarget(target);
    setGameState('outcome_overlay');

    // Bullet checks
    const isBang = currentChamber === bulletChamber;
    const nextChamber = (currentChamber + 1) % 6;
    
    if (isBang) {
      setBulletFired(true);
      setOverlayType('bang');
      playShotSound('bang');

      if (shooter === 'player') {
        if (target === 'self') {
          // Player shot self -> Player loses life
          setPlayerLives(l => l - 1);
        } else {
          // Player shot bot -> Bot loses life
          setBotLives(l => l - 1);
        }
      } else {
        // Bot is shooter (always shoots player in this mode)
        setPlayerLives(l => l - 1);
        setBotMessage(getRandomElement(BOT_TAUNTS[botName].shootPlayerBang));
      }
    } else {
      setOverlayType('click');
      playShotSound('click');
      setSpentChambers(prev => [...prev, currentChamber]);

      // If player shot self and survived, log stats
      if (shooter === 'player' && target === 'self') {
        const currentProb = getProbability();
        setStats(prev => ({
          ...prev,
          shotsSurvived: prev.shotsSurvived + 1,
          maxProbabilitySurvived: Math.max(prev.maxProbabilitySurvived, currentProb)
        }));
      }

      if (shooter === 'bot') {
        setBotMessage(getRandomElement(BOT_TAUNTS[botName].shootPlayerBlank));
      }

      // Rotate cylinder
      setCurrentChamber(nextChamber);
    }
  };

  // Player Trigger Handler (Correct Answer Actions)
  const handlePlayerShoot = (target) => {
    if (gameState !== 'shooting_choice') return;
    shoot('player', target);
  };

  // Next Question/Round transitions
  const handleNextQuestion = () => {
    // Check for game over (after deducting life)
    const deadPlayer = playerLives <= 0;
    const deadBot = botLives <= 0;

    if (deadPlayer || deadBot) {
      endSession();
      return;
    }

    if (bulletFired) {
      reloadGun();
    }

    // Set state for next question
    setTurn('player');
    setGameState('answering');
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setShootTarget(null);
    setOverlayType(null);
    setBulletFired(false);
    setIsShotFired(false); // Reset shot fired lock for the new round
    
    // Increment rounds
    setStats(prev => ({
      ...prev,
      roundsSurvived: prev.roundsSurvived + 1
    }));

    // Advance to next question
    const nextQIndex = currentQuestionIndex + 1;

    if (nextQIndex >= questions.length) {
      // Current batch exhausted — grab next batch from full pool
      const pool = questionPoolRef.current;
      let startIdx = poolIndexRef.current;
      
      // If pool itself is exhausted, reshuffle full pool
      if (startIdx >= pool.length) {
        const reshuffled = [...pool];
        for (let i = reshuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [reshuffled[i], reshuffled[j]] = [reshuffled[j], reshuffled[i]];
        }
        questionPoolRef.current = reshuffled;
        poolIndexRef.current = 0;
        startIdx = 0;
      }
      
      // Take next batch
      const endIdx = Math.min(startIdx + questionCount, pool.length);
      const nextBatch = questionPoolRef.current.slice(startIdx, endIdx);
      poolIndexRef.current = endIdx;
      
      setQuestions(nextBatch);
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(nextQIndex);
    }
    setBotMessage(getRandomElement(BOT_TAUNTS[botName].idle));
  };

  // Log Score & Terminate Session
  const endSession = () => {
    const finalResult = playerLives <= 0 ? 'DIED' : 'WON';
    const accuracy = stats.totalQuestionsAnswered > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;
    
    const scoreObject = {
      id: Date.now().toString(),
      name: playerName.trim() || 'REVISER',
      roundsSurvived: stats.roundsSurvived,
      correctAnswers: stats.correctAnswers,
      totalQuestionsAnswered: stats.totalQuestionsAnswered,
      accuracy,
      shotsSurvived: stats.shotsSurvived,
      maxProbabilitySurvived: stats.maxProbabilitySurvived,
      difficulty: difficulty,
      botName: botName,
      result: finalResult,
      date: new Date().toISOString()
    };

    const updatedLeaderboard = [scoreObject, ...leaderboardScores];
    setLeaderboardScores(updatedLeaderboard);
    localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(updatedLeaderboard));

    setScreen('result');
  };

  const handleRestart = () => {
    setScreen('home');
    clearPdf();
  };

  const clearPdf = () => {
    setPdfParsedText('');
    setPdfFileName('');
  };

  return (
    <div className="w-screen min-h-screen m-0 p-0 relative flex flex-col justify-between overflow-x-hidden bg-[#0a0805] text-[#f8fafc]">
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            key="screen-glitch-transition"
            className="glitch-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.95, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, times: [0, 0.18, 0.72, 1] }}
          >
            <span />
            <span />
            <span />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky top premium navigation bar */}
      {screen !== 'game' && (
        <header className="absolute top-0 z-30 w-full pt-4">
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center justify-between w-full">
          {/* Logo Left */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => screen !== 'game' && setScreen('home')}
          >
            <span className="text-[#f59e0b] font-bold text-[16px] tracking-[3px]">GAR</span>
          </div>

          {/* Navigation Links Center */}
          <nav className="flex items-center gap-4 bg-transparent p-0.5">
            {[
              ['home', 'Dashboard'],
              ['history', 'History']
            ].map(([key, label]) => {
              const isActive = screen === key || (key === 'home' && (screen === 'game' || screen === 'result'));
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === 'history') setScreen('history');
                    if (key === 'home' && screen !== 'game') setScreen('home');
                  }}
                  disabled={screen === 'game'}
                  className={`py-1.5 text-[13px] font-bold transition-all border-b-2 ${
                    isActive
                      ? 'border-[#f59e0b] text-[#f59e0b]'
                      : 'border-transparent text-[#a8a29e] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                soundEnabled
                  ? 'border-[#f59e0b] text-[#f59e0b] bg-transparent hover:bg-[rgba(245,158,11,0.1)]'
                  : 'border-white/10 text-[#a8a29e] bg-transparent hover:text-white'
              }`}
              title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Gemini Key Config */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`px-3 py-2 rounded-lg border text-[13px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                apiKey 
                  ? 'border-[#f59e0b] text-[#f59e0b] bg-transparent hover:bg-[rgba(245,158,11,0.1)]' 
                  : 'border-white/10 text-[#a8a29e] bg-transparent hover:text-white hover:border-[#f59e0b]/40'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{apiKey ? "Gemini Key Saved" : "Setup Gemini Key"}</span>
            </button>
          </div>
        </div>
      </header>
      )}

      {/* Screen Router */}
      <div className="flex-grow z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
            transition={{ duration: 0.34, ease: [0.2, 0.9, 0.2, 1] }}
          >
            {screen === 'home' && (
              <HomeScreen
                playerName={playerName}
                setPlayerName={setPlayerName}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                questionCount={questionCount}
                setQuestionCount={setQuestionCount}
                onStart={handleStartGame}
                hasApiKey={!!apiKey}
                onOpenSettings={() => setIsSettingsOpen(true)}
                soundEnabled={soundEnabled}
                onToggleSound={handleToggleSound}
                onOpenHistory={() => setScreen('history')}
                pdfParsedText={pdfParsedText}
                setPdfParsedText={setPdfParsedText}
                pdfFileName={pdfFileName}
                setPdfFileName={setPdfFileName}
                leaderboardScores={leaderboardScores}
                onClearLeaderboard={handleClearLeaderboard}
                onParsePdf={extractTextFromPdf}
                isGenerating={isGenerating}
                gameStartError={gameStartError}
                setGameStartError={setGameStartError}
              />
            )}

            {screen === 'game' && questions.length > 0 && (
              <GameScreen
                playerName={playerName}
                difficulty={difficulty}
                question={questions[currentQuestionIndex]}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                roundNumber={roundNumber}
                playerLives={playerLives}
                botLives={botLives}
                currentChamber={currentChamber}
                spentChambers={spentChambers}
                bulletFired={bulletFired}
                probability={getProbability()}
                turn={turn}
                isSpinning={isSpinning}
                botName={botName}
                botMessage={botMessage}
                isBotThinking={isBotThinking}
                onAnswer={handlePlayerAnswer}
                onShoot={handlePlayerShoot}
                gameState={gameState}
                selectedAnswer={selectedAnswer}
                shootTarget={shootTarget}
                overlayType={overlayType}
                onNextQuestion={handleNextQuestion}
                soundEnabled={soundEnabled}
                onToggleSound={handleToggleSound}
              />
            )}

            {screen === 'result' && (
              <ResultScreen
                playerName={playerName}
                difficulty={difficulty}
                playerLives={playerLives}
                botLives={botLives}
                botName={botName}
                stats={stats}
                leaderboardScores={leaderboardScores}
                onClearLeaderboard={handleClearLeaderboard}
                onRestart={handleRestart}
                onOpenHistory={() => setScreen('history')}
              />
            )}

            {screen === 'history' && (
              <HistoryScreen
                scores={leaderboardScores}
                onBack={() => setScreen('home')}
                onClear={handleClearLeaderboard}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiKey}
        savedKey={apiKey}
      />

      <footer className="w-full text-center py-4 text-[9px] text-slate-700 font-mono tracking-widest z-10 select-none uppercase">
        // SYSTEM TERMINAL SECURE // GAMIFIED ACTIVE RECALL PROTOCOL ACTIVE
      </footer>
    </div>
  );
}
