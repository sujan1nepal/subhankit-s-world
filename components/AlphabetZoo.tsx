
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const animals = [
  { char: 'A', name: 'Alligator', img: 'https://images.unsplash.com/photo-1549240923-93a2e080e653?w=800&q=80' },
  { char: 'B', name: 'Bear', img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&q=80' },
  { char: 'C', name: 'Cat', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80' },
  { char: 'D', name: 'Dog', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80' },
  { char: 'E', name: 'Elephant', img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80' },
  { char: 'F', name: 'Flamingo', img: 'https://images.unsplash.com/photo-1519066629447-267ffbb62d4b?w=800&q=80' },
  { char: 'G', name: 'Giraffe', img: 'https://images.unsplash.com/photo-1547721064-362726618170?w=800&q=80' },
  { char: 'L', name: 'Lion', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80' },
  { char: 'M', name: 'Monkey', img: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&q=80' },
  { char: 'P', name: 'Panda', img: 'https://images.unsplash.com/photo-1564349683136-77e08bef1ed1?w=800&q=80' },
  { char: 'T', name: 'Tiger', img: 'https://images.unsplash.com/photo-1508061263366-f7df158b61e0?w=800&q=80' },
  { char: 'Z', name: 'Zebra', img: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?w=800&q=80' },
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
    speak(`You got it! ${animal.char} is for ${animal.name}!`);
    confetti({ colors: ['#fbbf24', '#f59e0b', '#ffffff'], origin: { y: 0.7 } });
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % animals.length);
      setStatus('idle');
    }, 2000);
  };

  const handleFail = () => {
    setStatus('fail');
    speak(`Oops! Try to find the letter ${animal.char}!`);
    setTimeout(() => setStatus('idle'), 800);
  };

  return (
    <div className="w-full h-full bg-[#fefce8] flex flex-col items-center p-4 overflow-hidden">
      <div className="text-center shrink-0 mb-6 mt-2">
        <h2 className="text-4xl md:text-7xl font-black text-yellow-600 drop-shadow-sm uppercase tracking-tighter">Alphabet Zoo</h2>
      </div>

      <div className="flex-grow flex items-center justify-center w-full max-w-4xl min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={animal.char}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -50 }}
            className="flex flex-col items-center bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border-[12px] border-yellow-200 w-full h-full clay-card min-h-0 overflow-hidden"
          >
            <div className="flex-grow w-full rounded-[2rem] overflow-hidden mb-6 shadow-inner border-2 border-yellow-50 min-h-0">
              <img src={animal.img} alt={animal.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-center shrink-0">
              <motion.div
                animate={status === 'success' ? { scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] } : {}}
                className={`text-7xl md:text-[10rem] font-black leading-none drop-shadow-md ${status === 'fail' ? 'text-red-500' : 'text-yellow-600'}`}
              >
                {animal.char}
              </motion.div>
              <div className="text-3xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter">
                {animal.name}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="mt-4 mb-2 shrink-0">
        <div className="bg-yellow-500/80 px-8 py-2 rounded-full border-2 border-yellow-200 shadow-md">
          <span className="text-white text-lg md:text-xl font-black uppercase tracking-[0.2em] italic">
            Press the "{animal.char}" key! ⌨️
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlphabetZoo;
