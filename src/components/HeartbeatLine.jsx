import React from 'react';

export default function HeartbeatLine({ riskLevel = 0, className = '' }) {
  let speed = '2s';
  if (riskLevel >= 75) speed = '0.35s';
  else if (riskLevel >= 50) speed = '0.7s';
  else if (riskLevel >= 25) speed = '1.2s';

  const color = riskLevel >= 75 ? '#ef4444' : '#f59e0b';

  return (
    <div className={`w-full h-[32px] overflow-hidden ${className}`}>
      <svg 
        viewBox="0 0 200 32" 
        preserveAspectRatio="none" 
        className="h-full stroke-current fill-none"
        style={{ 
          width: '200%',
          color,
          animation: `ecg-scroll ${speed} linear infinite`
        }}
      >
        <path
          d="M 0,16 L 20,16 L 25,4 L 30,28 L 35,16 L 100,16 M 100,16 L 120,16 L 125,4 L 130,28 L 135,16 L 200,16"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <style>{`
        @keyframes ecg-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
