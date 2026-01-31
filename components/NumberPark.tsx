
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const DUCK_IMAGE = 'https://images.unsplash.com/photo-1563409236302-8442b5e644df?w=600&h=600&fit=crop';

const NumberPark: React.FC<Props> = ({ speak }) => {
  const [targetNum, setTargetNum] = useState(1);
  const [objects, setObjects] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const generateChallenge = useCallback(() => {
    const num = Math.floor(Math.random() * 9) + 1;
    setTargetNum(num);
    setObjects(Array.from({ length: num }, (_, i) => i));
    speak(`How many fluffy ducks can you count? Type the number!`);
  }, [speak]);

  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  const processKey = useCallback((key: string) => {
    const num = parseInt(key);
    if (isNaN(num)) return;
    
    if (num === targetNum) {
      handleSuccess();
    } else {
      speak(`That's ${num}. Try again! Count carefully and find ${targetNum}!`);
    }
  }, [targetNum, speak]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        processKey(e.key);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [processKey]);

  const handleSuccess = () => {
    setScore(s => s + 1);
    speak(`${targetNum}! You got it!`);
    confetti({ 
      particleCount: 150, 
      spread: 120, 
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ffffff', '#fbbf24']
    });
    setTimeout(generateChallenge, 2500);
  };

  return (
    <div className="w-full h-full bg-[#f5f3ff] flex flex-col items-center p-4 overflow-hidden">
      <div className="text-center shrink-0 mb-2 mt-2">
        <h2 className="text-3xl md:text-5xl font-black text-purple-600 drop-shadow-sm uppercase tracking-tighter">Number Park</h2>
      </div>

      <div className="flex-grow w-full max-w-7xl flex items-center justify-center p-2 min-h-0">
        <div className="bg-white/95 rounded-[3rem] shadow-2xl border-4 border-purple-100 p-4 md:p-8 flex flex-wrap justify-center items-center gap-2 md:gap-4 w-full h-full clay-card overflow-hidden content-center">
          <AnimatePresence mode="popLayout">
            {objects.map((id) => (
              <motion.div
                key={id}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-lg border-2 border-purple-50 p-1 md:p-2 bg-white clay-btn shrink-0"
              >
                <img 
                  src={DUCK_IMAGE} 
                  alt="duck" 
                  className="w-full h-full object-contain rounded-[1.5rem] md:rounded-[2.5rem]" 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 mb-4 shrink-0 flex items-center gap-4">
        <div className="bg-purple-600 px-8 py-3 rounded-full shadow-lg border-b-4 border-purple-800">
          <span className="text-white text-xl md:text-2xl font-black uppercase tracking-widest italic">
            Count the ducks!
          </span>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-full shadow-xl border-4 border-purple-200 flex items-center gap-3">
          <span className="text-purple-400 text-lg font-black uppercase">SCORE</span>
          <motion.span 
            key={score}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="text-3xl md:text-5xl font-black text-purple-600"
          >
            {score}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default NumberPark;
