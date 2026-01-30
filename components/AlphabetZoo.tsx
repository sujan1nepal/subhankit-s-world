
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const animals = [
  { char: 'A', name: 'Alligator', img: 'https://images.unsplash.com/photo-1549240923-93a2e080e653?w=1000&q=80' },
  { char: 'B', name: 'Bear', img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=1000&q=80' },
  { char: 'C', name: 'Cat', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000&q=80' },
  { char: 'D', name: 'Dog', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80' },
  { char: 'E', name: 'Elephant', img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1000&q=80' },
  { char: 'F', name: 'Flamingo', img: 'https://images.unsplash.com/photo-1519066629447-267ffbb62d4b?w=1000&q=80' },
  { char: 'G', name: 'Giraffe', img: 'https://images.unsplash.com/photo-1547721064-362726618170?w=1000&q=80' },
  { char: 'L', name: 'Lion', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1000&q=80' },
  { char: 'M', name: 'Monkey', img: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=1000&q=80' },
  { char: 'P', name: 'Panda', img: 'https://images.unsplash.com/photo-1564349683136-77e08bef1ed1?w=1000&q=80' },
  { char: 'T', name: 'Tiger', img: 'https://images.unsplash.com/photo-1508061263366-f7df158b61e0?w=1000&q=80' },
  { char: 'Z', name: 'Zebra', img: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?w=1000&q=80' },
];

const AlphabetZoo: React.FC<Props> = ({ speak }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const animal = animals[currentIndex];

  const processKey = useCallback((key: string) => {
    if (status !== 'idle') return;
    const pressedKey = key.toUpperCase();
    if (pressedKey === animal.char) {
      handleSuccess();
    } else if (/^[A-Z]$/.test(pressedKey)) {
      handleFail();
    }
  }, [animal, status]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => processKey(e.key);
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [processKey]);

  const handleSuccess = () => {
    setStatus('success');
    speak(`Perfect! ${animal.char} is for ${animal.name}!`);
    confetti({ 
      particleCount: 100, 
      spread: 70, 
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#ffffff'] 
    });
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % animals.length);
      setStatus('idle');
    }, 2000);
  };

  const handleFail = () => {
    setStatus('fail');
    speak(`Oops! Can you find ${animal.char}?`);
    setTimeout(() => setStatus('idle'), 800);
  };

  return (
    <div className="w-full h-full bg-[#fefce8] flex flex-col items-center p-2 md:p-4 overflow-hidden">
      <div className="text-center shrink-0 mb-2 mt-1">
        <h2 className="text-3xl md:text-5xl font-black text-yellow-600 drop-shadow-sm uppercase">Alphabet Zoo</h2>
      </div>

      <div className="flex-grow flex items-center justify-center w-full max-w-6xl min-h-0 p-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={animal.char}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center bg-white p-4 md:p-6 rounded-[4rem] shadow-2xl border-[12px] border-yellow-100 w-full h-full clay-card overflow-hidden"
          >
            <div className="flex-grow w-full rounded-[2.5rem] overflow-hidden mb-4 shadow-inner border-2 border-yellow-50 relative bg-yellow-50/30">
              <img src={animal.img} alt={animal.name} className="w-full h-full object-contain" />
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="absolute inset-0 bg-yellow-400/10 backdrop-blur-[2px] flex items-center justify-center"
                >
                  <span className="text-white text-9xl font-black drop-shadow-lg">✨</span>
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-6 text-center shrink-0 p-2">
              <motion.div
                animate={status === 'success' ? { scale: [1, 1.2, 1] } : {}}
                className={`text-7xl md:text-[8rem] font-black leading-none drop-shadow-md ${status === 'fail' ? 'text-red-500 animate-shake' : 'text-yellow-600'}`}
              >
                {animal.char}
              </motion.div>
              <div className="text-3xl md:text-6xl font-black text-gray-800 italic uppercase">
                {animal.name}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="mt-2 mb-2 shrink-0">
        <div className="bg-yellow-500 px-6 py-2 rounded-full shadow-md">
          <span className="text-white text-lg font-black uppercase tracking-widest italic">
            Find the "{animal.char}" key! ⌨️
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlphabetZoo;
