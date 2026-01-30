
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const DUCK_IMAGE = 'https://images.unsplash.com/photo-1563409236302-8442b5e644df?w=400&h=400&fit=crop';

const NumberPark: React.FC<Props> = ({ speak }) => {
  const [targetNum, setTargetNum] = useState(1);
  const [objects, setObjects] = useState<number[]>([]);

  const generateChallenge = useCallback(() => {
    const num = Math.floor(Math.random() * 9) + 1;
    setTargetNum(num);
    setObjects(Array.from({ length: num }, (_, i) => i));
    speak(`How many fluffy ducks can you count? Type the number on your keyboard!`);
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
      speak(`That's ${num}. Let's count again! Find the number ${targetNum}!`);
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
    speak(`Yay! ${targetNum}! You're so smart!`);
    confetti({ 
      particleCount: 150, 
      spread: 120, 
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ffffff', '#fbbf24']
    });
    setTimeout(generateChallenge, 3000);
  };

  return (
    <div className="w-full h-full bg-[#f5f3ff] flex flex-col items-center p-4 overflow-hidden">
      <div className="text-center shrink-0 mb-4 mt-2">
        <h2 className="text-4xl md:text-7xl font-black text-purple-600 drop-shadow-sm uppercase tracking-tighter">Number Park</h2>
        <div className="mt-1 bg-white/60 px-6 py-1 rounded-full border-2 border-purple-200 inline-block">
          <p className="text-purple-800 font-black text-lg md:text-xl uppercase tracking-widest">
            Type the number! 🦆
          </p>
        </div>
      </div>

      <div className="flex-grow w-full max-w-7xl flex items-center justify-center p-4">
        <div className="bg-white/90 rounded-[3rem] shadow-xl border-4 border-purple-200 p-8 flex flex-wrap justify-center items-center gap-4 w-full h-full max-h-[70vh] clay-card overflow-hidden">
          <AnimatePresence mode="popLayout">
            {objects.map((id) => (
              <motion.div
                key={id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-[2rem] overflow-hidden shadow-lg border-2 border-purple-100 p-2 bg-white clay-btn shrink-0"
              >
                <img 
                  src={DUCK_IMAGE} 
                  alt="duck" 
                  className="w-full h-full object-cover rounded-[1.5rem]" 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-4 shrink-0">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-purple-600 px-8 py-3 rounded-full shadow-lg text-white font-black text-xl uppercase italic"
        >
          Count them all!
        </motion.div>
      </div>
    </div>
  );
};

export default NumberPark;
