/**
 * EcgMonitor Component
 * Renders an animated ECG heartbeat wave.
 * @param {string} speed - 'normal', 'fast', 'panic'
 * @param {string} color - 'green', 'red'
 */
export default function EcgMonitor({ speed = 'normal', color = 'green' }) {
  // Map speeds to sweep animation durations
  const duration = speed === 'panic' ? '0.6s' : speed === 'fast' ? '1.0s' : '1.8s';
  const strokeColor = color === 'red' ? '#ef4444' : '#a855f7';
  const shadowGlow = color === 'red' ? 'rgba(239,68,68,0.18)' : 'rgba(124,58,237,0.14)';

  return (
    <div 
      className="w-full h-8 bg-[#08080f] border border-[rgba(124,58,237,0.2)] rounded-lg overflow-hidden relative flex items-center transition-all duration-300"
      style={{ boxShadow: `inset 0 0 10px ${shadowGlow}` }}
    >
      {/* Oscilloscope Grid Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />

      {/* Drawing Path */}
      <svg className="w-full h-full" viewBox="0 0 300 50" preserveAspectRatio="none">
        <path
          d="M 0,25 L 30,25 Q 38,25 42,20 T 48,25 L 55,25 L 59,38 L 64,5 L 68,28 L 74,25 Q 82,20 86,25 L 120,25 L 150,25 Q 158,25 162,20 T 168,25 L 175,25 L 179,38 L 184,5 L 188,28 L 194,25 Q 202,20 206,25 L 240,25 L 270,25 Q 278,25 282,20 T 288,25 L 295,25"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: '600',
            strokeDashoffset: '600',
            animation: `ecgSweep ${duration} linear infinite`
          }}
        />
      </svg>

      {/* CRT flicker effect on top of wave */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/2 to-transparent mix-blend-overlay opacity-50" />

      {/* Sweep glow beam effect */}
      <div className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-[#a855f7]/10 to-transparent pointer-events-none animate-scan-beam" />

      <style>{`
        @keyframes ecgSweep {
          0% {
            stroke-dashoffset: 600;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes scan-beam {
          0% { left: -10%; }
          100% { left: 110%; }
        }
        .animate-scan-beam {
          animation: scan-beam 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
