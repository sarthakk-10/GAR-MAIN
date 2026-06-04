import { ArrowLeft, BarChart3, CalendarClock, Shield, Target, Trash2 } from 'lucide-react';

export default function HistoryScreen({ scores = [], onBack, onClear }) {
  const sortedScores = [...scores].sort((a, b) => new Date(b.date) - new Date(a.date));
  const bestAccuracy = sortedScores.reduce((best, score) => Math.max(best, score.accuracy || 0), 0);
  const bestRounds = sortedScores.reduce((best, score) => Math.max(best, score.roundsSurvived || 0), 0);
  const totalSessions = sortedScores.length;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-10 text-[#f8fafc]">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[rgba(124,58,237,0.15)] pb-6 mb-8">
        <div>
          <p className="hud-label text-[10px] tracking-widest text-[#94a3b8] mb-1">REVISER LOGS</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase text-white leading-none font-heading">
            MISSION <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">HISTORY</span>
          </h1>
        </div>
        <div className="flex gap-3">
          {scores.length > 0 && (
            <button
              onClick={onClear}
              className="btn-secondary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <Trash2 className="w-4 h-4" />
              Wipe History
            </button>
          )}
          <button
            onClick={onBack}
            className="btn-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0f0f1a]/80 border border-[rgba(124,58,237,0.2)] rounded-2xl p-5 flex flex-col justify-between hover:border-[#7c3aed]/35 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="hud-label text-[9px] font-bold">TOTAL SESSIONS</span>
            <CalendarClock className="w-4 h-4 text-[#a855f7]" />
          </div>
          <p className="text-3xl font-black text-white mt-1 font-heading">{totalSessions}</p>
        </div>
        <div className="bg-[#0f0f1a]/80 border border-[rgba(124,58,237,0.2)] rounded-2xl p-5 flex flex-col justify-between hover:border-[#7c3aed]/35 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="hud-label text-[9px] font-bold">BEST ACCURACY</span>
            <Target className="w-4 h-4 text-[#a855f7]" />
          </div>
          <p className="text-3xl font-black text-white mt-1 font-heading">{bestAccuracy}%</p>
        </div>
        <div className="bg-[#0f0f1a]/80 border border-[rgba(124,58,237,0.2)] rounded-2xl p-5 flex flex-col justify-between hover:border-[#7c3aed]/35 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="hud-label text-[9px] font-bold">BEST ROUNDS RECORD</span>
            <Shield className="w-4 h-4 text-[#a855f7]" />
          </div>
          <p className="text-3xl font-black text-white mt-1 font-heading">{bestRounds}</p>
        </div>
      </div>

      {/* Scoreboard history list table */}
      <div className="saas-card p-6 overflow-x-auto">
        {sortedScores.length === 0 ? (
          <div className="py-14 text-center text-xs text-[#94a3b8]/70 flex flex-col items-center justify-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#94a3b8]/40" />
            <span className="uppercase tracking-wider font-bold">No active recall sessions recorded.</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[rgba(124,58,237,0.15)] text-[#94a3b8] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-3">DATE / TIME</th>
                <th className="py-3 px-3">STUDENT ALIAS</th>
                <th className="py-3 px-3 text-center">ACCURACY</th>
                <th className="py-3 px-3 text-center">CORRECT SELECTIONS</th>
                <th className="py-3 px-3 text-center">ROUNDS</th>
                <th className="py-3 px-3 text-center">MAX RISK SURVIVED</th>
                <th className="py-3 px-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((score) => (
                <tr key={score.id} className="border-b border-[rgba(124,58,237,0.1)] hover:bg-[#161625]/45 transition-colors">
                  <td className="py-3 px-3 text-[#94a3b8]/60">{formatDate(score.date)}</td>
                  <td className="py-3 px-3 text-white font-extrabold">{score.name}</td>
                  <td className="py-3 px-3 text-center text-white font-extrabold">{score.accuracy ?? 0}%</td>
                  <td className="py-3 px-3 text-center text-[#94a3b8]">{score.correctAnswers ?? 0} / {score.totalQuestionsAnswered ?? 0}</td>
                  <td className="py-3 px-3 text-center text-[#94a3b8]">{score.roundsSurvived}</td>
                  <td className="py-3 px-3 text-center text-[#a855f7] font-extrabold">{Number(score.maxProbabilitySurvived || 0).toFixed(0)}%</td>
                  <td className={`py-3 px-3 text-center font-bold ${score.result === 'WON' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {score.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
