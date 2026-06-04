import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________';

export default function GlitchText({ text, delay = 0, className = "" }) {
  const [displayText, setDisplayText] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    
    let isCancelled = false;
    let iteration = 0;
    
    const startGlitch = () => {
      hasRun.current = true;
      const interval = setInterval(() => {
        if (isCancelled) return;
        
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration || char === ' ') {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        
        if (iteration >= text.length) {
          clearInterval(interval);
        }
        
        iteration += 1/3; // Controls speed (3 ticks per letter)
      }, 30); // 30ms per tick ~ 90ms per letter

      return () => clearInterval(interval);
    };

    const timer = setTimeout(startGlitch, delay);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [text, delay]);

  return <span className={className}>{displayText}</span>;
}
