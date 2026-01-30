
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const DUCK_IMAGE = 'https://images.unsplash.com/photo-1563409236302-8442b5e644df?w=500&h=500&fit=crop';

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
      speak(`That's ${num}. Try again! Find the number ${targetNum}!`);
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
    speak(`Yay! ${targetNum}! You're a math whiz!`);
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
      <div className="w-full max-w-7xl flex justify-between items-center mb-4 shrink-0 mt-2 px-6">
        <h2 className="text-4xl md:text-7xl font-black text-purple-600 drop-shadow-sm uppercase tracking-tighter">Number Park</h2>
        
        <div className="bg-white/90 p-4 rounded-3xl shadow-xl border-4 border-purple-100 flex items-center gap-4">
          <span className="text-purple-400 text-2xl font-black">SCORE:</span>
          <motion.span 
            key={score}
            initial={{ scale: 1.5, color: '#a855f7' }}
            animate={{ scale: 1, color: '#7e22ce' }}
            className="text-5xl font-black text-purple-600"
          >
            {score}
          </motion.span>
        </div>
      </div>

      <div className="flex-grow w-full max-w-7xl flex items-center justify-center p-4 min-h-0">
        <div className="bg-white/90 rounded-[4rem] shadow-2xl border-8 border-purple-100 p-8 flex flex-wrap justify-center items-center gap-6 w-full h-full clay-card overflow-hidden content-center">
          <AnimatePresence mode="popLayout">
            {objects.map((id) => (
              <motion.div
                key={id}
                initial={{ scale: 0, rotate: -20, y: 30 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: id * 0.05 }}
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-56 md:h-56 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-purple-50 p-3 bg-white clay-btn shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={DUCK_IMAGE} 
                  alt="duck" 
                  className="w-full h-full object-cover rounded-[2rem]" 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 mb-2 shrink-0">
        <div className="bg-purple-600 px-10 py-3 rounded-full shadow-lg">
          <span className="text-white text-2xl font-black uppercase tracking-widest italic">
            How many ducks? Type the number!
          </span>
        </div>
      </div>
    </div>
  );
};

export default NumberPark;
