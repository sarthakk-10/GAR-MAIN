import { motion } from 'framer-motion';

export default function Cylinder({ currentChamber, spentChambers, isSpinning, bulletFired, probability, chamberCount, bulletCount, bulletChambers, bulletsFiredThisRound = 0 }) {
  const getRiskColor = (prob) => {
    if (prob < 25) return 'text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]'; // Green
    if (prob < 50) return 'text-[#eab308] drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]'; // Yellow
    if (prob < 75) return 'text-[#f97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]'; // Orange
    return 'text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]'; // Red
  };

  return (
    <div className="bg-[rgba(0,0,0,0.65)] border border-[rgba(245,158,11,0.2)] px-[24px] py-[20px] rounded-[12px] w-full max-w-[1000px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-[32px] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      
      {/* 1. Left Label */}
      <div className="flex flex-col lg:text-left text-center shrink-0 min-w-[200px]">
        <span className="text-[10px] text-[#57534e] tracking-[2px] font-bold uppercase mb-1">CHAMBER INDEX</span>
        <span className="text-white font-bold text-[18px] tracking-wider whitespace-nowrap">{chamberCount}-CHAMBER REVOLVER</span>
        <div className="mt-2 text-[#ef4444] font-bold text-[14px]">
          <span>{bulletCount - bulletsFiredThisRound} BULLETS REMAINING</span>
        </div>
      </div>

      {/* 2. The Cylinder */}
      <div className="flex-1 flex items-center justify-center gap-[12px] flex-wrap max-w-[500px] mx-auto w-full">
        {Array.from({ length: chamberCount }, (_, i) => i).map((index) => {
          const isSpent = spentChambers.includes(index);
          const isActive = currentChamber === index;
          const isBullet = bulletChambers.includes(index);
          const isFiredBullet = bulletFired && isActive && isBullet;

          let chamberClass = "w-[48px] h-[48px] md:w-[56px] md:h-[56px] shrink-0 rounded-full flex items-center justify-center font-bold text-[12px] md:text-[13px] transition-all duration-300";
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
      <div className="shrink-0 min-w-[120px] lg:text-right text-center lg:border-l lg:border-[rgba(245,158,11,0.2)] lg:pl-6 flex flex-col justify-center">
        <span className="text-[10px] text-[#57534e] tracking-[2px] font-bold uppercase mb-1">RISK LEVEL</span>
        <span className={`text-[32px] font-black leading-none mt-1 ${getRiskColor(probability)}`}>
          {probability.toFixed(0)}%
        </span>
      </div>
      
    </div>
  );
}
