import { Trophy, Zap, Trash2 } from 'lucide-react';

export default function Leaderboard({ scores = [], onClear, theme = 'crt' }) {
  const isHome = theme === 'home';

  // Sort scores: score desc, then difficulty weight, then date desc
  const sortedScores = [...scores].sort((a, b) => {
    if (b.score !== a.score) {
      return (b.score || 0) - (a.score || 0);
    }
    const difficultyWeight = { hard: 3, medium: 2, easy: 1 };
    const diffA = difficultyWeight[a.difficulty?.toLowerCase()] || 0;
    const diffB = difficultyWeight[b.difficulty?.toLowerCase()] || 0;
    if (diffB !== diffA) {
      return diffB - diffA;
    }
    return new Date(b.date) - new Date(a.date);
  });

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  if (isHome) {
    return (
      <div 
        className="px-[24px] py-[20px] rounded-[12px] w-full text-white h-full"
        style={{
          backgroundColor: 'rgba(0,0,0,0.65)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-[16px]">
          <div className="flex items-center gap-2">
            <Trophy className="w-[18px] h-[18px] text-[#f59e0b]" />
            <h3 className="text-[16px] font-bold text-white">
              Mission History
            </h3>
          </div>
          {scores.length > 0 && (
            <button
              onClick={onClear}
              className="text-[11px] hover:text-[#ef4444] cursor-pointer transition-colors text-[#57534e]"
              title="Wipe leaderboard logs"
            >
              WIPE LOGS
            </button>
          )}
        </div>

        {/* Table content */}
        {sortedScores.length === 0 ? (
          <div className="pt-10 pb-6 text-center">
            <span className="text-[14px] text-[#57534e] italic">No missions logged yet. Load your first protocol to begin.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.04)] uppercase text-[10px] text-[#57534e]">
                  <th className="py-[12px] pr-2 font-normal">Agent</th>
                  <th className="py-[12px] px-2 text-center font-normal">Accuracy</th>
                  <th className="py-[12px] px-2 text-center font-normal">Score</th>
                  <th className="py-[12px] px-2 text-center font-normal">Level</th>
                  <th className="py-[12px] px-2 text-center font-normal">Result</th>
                  <th className="py-[12px] pl-2 text-right font-normal">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {sortedScores.map((score, index) => {
                  const survived = score.result === 'WON' || score.result === 'SURVIVED';
                  return (
                    <tr 
                      key={score.id || index}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    >
                      <td className="py-[12px] pr-2 truncate max-w-[120px] flex items-center gap-2">
                        <span className="text-[13px] font-bold text-white">{score.name}</span>
                      </td>
                      <td className="py-[12px] px-2 text-center text-white text-[13px]">
                        {score.accuracy ?? 0}%
                      </td>
                      <td className="py-[12px] px-2 text-center text-white text-[13px]">
                        {score.score || 0}
                      </td>
                      <td className="py-[12px] px-2 text-center">
                        <span className={`px-[8px] py-[2px] rounded-full text-[10px] border ${
                          score.difficulty?.toLowerCase() === 'hard' 
                            ? 'border-[rgba(239,68,68,0.15)] text-[#ef4444]' 
                            : score.difficulty?.toLowerCase() === 'medium'
                            ? 'border-[rgba(255,255,255,0.08)] text-[#a8a29e]'
                            : 'border-[rgba(34,197,94,0.15)] text-[#22c55e]'
                        }`}>
                          {score.difficulty}
                        </span>
                      </td>
                      <td className="py-[12px] px-2 text-center">
                        <span className={`text-[12px] font-bold ${survived ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                          {score.result}
                        </span>
                      </td>
                      <td className="py-[12px] pl-2 text-right text-[11px] text-[#57534e]">
                        {formatDate(score.date)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // CRT Theme (Game/Result Screens)
  return (
    <div className="bg-black/80 border-2 border-[#00ff41]/40 p-5 rounded-sm shadow-[0_0_15px_rgba(0,200,0,0.2)] w-full relative font-mono text-[#00ff41] overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 pointer-events-none opacity-40" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ff41]/30 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#00ff41]" />
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center">
              ACTIVE_SURVIVAL_SCOREBOARD:
              <span className="w-2 h-4 bg-[#00ff41] ml-2 animate-pulse" />
            </h3>
          </div>
          {scores.length > 0 && (
            <button
              onClick={onClear}
              className="text-[10px] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer transition-colors font-bold uppercase tracking-wider text-[#00ff41]/70"
              title="Wipe leaderboard logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              WIPE LOGS
            </button>
          )}
        </div>

        {/* Table content */}
        {sortedScores.length === 0 ? (
          <div className="py-10 text-center text-xs flex flex-col items-center justify-center gap-3 border border-dashed rounded-sm border-[#00ff41]/30 bg-[#00ff41]/5 text-[#00ff41]/60">
            <Zap className="w-6 h-6 text-[#00ff41]/40" />
            <span className="uppercase tracking-wider font-bold">No revision sessions on record. Choose a subject and load trigger.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b uppercase tracking-wider text-[10px] font-bold border-[#00ff41]/30 text-[#00ff41]/70">
                  <th className="py-3 pr-2">AGENT</th>
                  <th className="py-3 px-2 text-center">ACCURACY</th>
                  <th className="py-3 px-2 text-center">SCORE</th>
                  <th className="py-3 px-2 text-center">LEVEL</th>
                  <th className="py-3 px-2 text-center">RESULT</th>
                  <th className="py-3 pl-2 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {sortedScores.map((score, index) => {
                  const isTop = index === 0;
                  const survived = score.result === 'WON' || score.result === 'SURVIVED';
                  return (
                    <tr 
                      key={score.id || index}
                      className={`border-b transition-colors border-[#00ff41]/20 hover:bg-[#00ff41]/10 ${
                        isTop ? `bg-[#00ff41]/5 font-bold` : ''
                      }`}
                    >
                      <td className="py-3 pr-2 truncate max-w-[120px] flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${isTop ? 'text-[#00ff41]' : 'text-[#00ff41]/40'}`}>
                          #{index + 1}
                        </span>
                        <span className={isTop ? 'text-[#00ff41]' : 'text-[#00ff41]/70'}>{score.name}</span>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-[#00ff41]">
                        {score.accuracy ?? 0}%
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-[#00ff41]">
                        {score.score || 0}
                      </td>
                      <td className="py-3 px-2 text-center uppercase">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] border font-bold ${
                          score.difficulty?.toLowerCase() === 'hard' 
                            ? 'border-red-500/50 text-red-500 bg-red-950/30' 
                            : score.difficulty?.toLowerCase() === 'medium'
                            ? 'border-[#00ff41]/50 text-[#00ff41] bg-[#00ff41]/10'
                            : 'border-zinc-500/50 text-[#00ff41]/60 bg-black'
                        }`}>
                          {score.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-bold">
                        <span className={survived ? 'text-[#00ff41]' : 'text-red-500 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]'}>
                          {score.result}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right text-[10px] text-[#00ff41]/50">
                        {formatDate(score.date)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
