import { motion } from 'framer-motion';

export default function Cylinder({ currentChamber, spentChambers, isSpinning, bulletFired, probability }) {
  const getRiskColor = (prob) => {
    if (prob < 25) return 'text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]'; // Green
    if (prob < 50) return 'text-[#eab308] drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]'; // Yellow
    if (prob < 75) return 'text-[#f97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]'; // Orange
    return 'text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]'; // Red
  };

  return (
    <div className="bg-[rgba(0,0,0,0.65)] border border-[rgba(245,158,11,0.2)] px-[24px] py-[16px] rounded-[12px] w-full flex items-center justify-between gap-[12px] overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      
      {/* 1. Left Label */}
      <div className="flex flex-col text-left shrink-0 min-w-[160px] mr-[16px]">
        <span className="text-[10px] text-[#a8a29e] tracking-widest font-bold uppercase mb-1">CHAMBER INDEX</span>
        <span className="text-white font-bold text-[15px] tracking-wider whitespace-nowrap">6-ROUND REVOLVER</span>
      </div>

      {/* 2. The Cylinder */}
      <div className="flex items-center gap-[8px] relative shrink-0">
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isSpent = spentChambers.includes(index);
          const isActive = currentChamber === index;
          const isFiredBullet = bulletFired && isActive;

          let chamberClass = "w-[52px] h-[52px] shrink-0 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300";
          let label = "";

          if (isSpinning) {
            chamberClass += " border-[1.5px] border-[rgba(245,158,11,0.4)] bg-transparent text-[#f59e0b]/40";
          } else if (isSpent) {
            chamberClass += " border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[#a8a29e]/30";
          } else if (isActive) {
            if (isFiredBullet) {
               chamberClass += " border-[2px] border-[#ef4444] bg-[rgba(239,68,68,0.2)] text-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.6)]";
            } else {
               chamberClass += " border-[2px] border-[#f59e0b] bg-[rgba(245,158,11,0.15)] text-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.4)]";
               label = "LIVE";
            }
          } else {
            chamberClass += " border-[1.5px] border-[rgba(245,158,11,0.4)] bg-transparent text-[#f59e0b]/60";
          }

          return (
            <div key={index} className="flex flex-col items-center gap-2 shrink-0">
              <motion.div
                animate={isSpinning ? { rotateX: [0, 360] } : { rotateX: 0 }}
                transition={isSpinning ? { duration: 0.2, repeat: Infinity, ease: "linear" } : { duration: 0 }}
                className={chamberClass}
              >
                0{index + 1}
              </motion.div>
              <div className="h-4 flex items-center justify-center">
                {label && (
                  <motion.span 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[10px] text-[#f59e0b] font-bold tracking-widest uppercase"
                  >
                    {label}
                  </motion.span>
                )}
                {isFiredBullet && (
                   <motion.span 
                    initial={{ opacity: 0, scale: 0 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="text-[10px] text-[#ef4444] font-bold tracking-widest uppercase"
                  >
                    BANG
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Right side (risk level) */}
      <div className="shrink-0 min-w-[100px] text-right border-l border-[rgba(245,158,11,0.2)] pl-6 ml-[16px] flex flex-col justify-center">
        <span className="text-[10px] text-[#a8a29e] tracking-[2px] font-bold uppercase mb-1">RISK LEVEL</span>
        <span className={`text-[28px] font-bold leading-none ${getRiskColor(probability)}`}>
          {probability.toFixed(0)}%
        </span>
      </div>
      
    </div>
  );
}
