
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import VirtualKeyboard from './VirtualKeyboard.tsx';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const animals = [
  { char: 'A', name: 'Alligator', img: 'https://images.unsplash.com/photo-1549240923-93a2e080e653?w=600&q=80' },
  { char: 'B', name: 'Bear', img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&q=80' },
  { char: 'C', name: 'Cat', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80' },
  { char: 'D', name: 'Dog', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80' },
  { char: 'E', name: 'Elephant', img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&q=80' },
  { char: 'F', name: 'Flamingo', img: 'https://images.unsplash.com/photo-1519066629447-267ffbb62d4b?w=600&q=80' },
  { char: 'G', name: 'Giraffe', img: 'https://images.unsplash.com/photo-1547721064-362726618170?w=600&q=80' },
  { char: 'H', name: 'Horse', img: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80' },
  { char: 'I', name: 'Iguana', img: 'https://images.unsplash.com/photo-1548232821-8eb2cb40ba4a?w=600&q=80' },
  { char: 'J', name: 'Jellyfish', img: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=600&q=80' },
  { char: 'K', name: 'Koala', img: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=600&q=80' },
  { char: 'L', name: 'Lion', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&q=80' },
  { char: 'M', name: 'Monkey', img: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&q=80' },
  { char: 'O', name: 'Owl', img: 'https://images.unsplash.com/photo-1544391496-1ca7c97457cd?w=600&q=80' },
  { char: 'P', name: 'Panda', img: 'https://images.unsplash.com/photo-1564349683136-77e08bef1ed1?w=600&q=80' },
  { char: 'R', name: 'Rabbit', img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&q=80' },
  { char: 'S', name: 'Snake', img: 'https://images.unsplash.com/photo-1531386151447-fd76ad500b2a?w=600&q=80' },
  { char: 'T', name: 'Tiger', img: 'https://images.unsplash.com/photo-1508061263366-f7df158b61e0?w=600&q=80' },
  { char: 'U', name: 'Unicorn', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80' },
  { char: 'W', name: 'Whale', img: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=600&q=80' },
  { char: 'Z', name: 'Zebra', img: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?w=600&q=80' },
];

const AlphabetZoo: React.FC<Props> = ({ speak }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const animal = animals[currentIndex];

  const processKey = (key: string) => {
    if (status !== 'idle') return;
    const pressedKey = key.toUpperCase();
    if (pressedKey === animal.char) {
      handleSuccess();
    } else if (/^[A-Z]$/.test(pressedKey)) {
      handleFail();
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => processKey(e.key);
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [animal, status]);

  const handleSuccess = () => {
    setStatus('success');
    speak(`Perfect! ${animal.char} is for ${animal.name}!`);
    confetti({ colors: ['#fbbf24', '#f59e0b', '#ffffff'], origin: { y: 0.7 } });
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % animals.length);
      setStatus('idle');
    }, 2500);
  };

  const handleFail = () => {
    setStatus('fail');
    speak(`Not that one. Let's find the letter ${animal.char}!`);
    setTimeout(() => setStatus('idle'), 1000);
  };

  return (
    <div className="w-full h-full bg-[#fefce8] flex flex-col items-center p-8 perspective-container">
      <h2 className="text-4xl md:text-7xl font-black text-yellow-600 mb-8 drop-shadow-md">Alphabet Zoo</h2>

      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={animal.char}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -50 }}
            className="flex flex-col items-center bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl border-8 border-yellow-200 w-full clay-card"
          >
            <div className="w-full h-[40vh] md:h-[50vh] rounded-[3rem] overflow-hidden mb-10 shadow-inner border-4 border-yellow-50">
              <img src={animal.img} alt={animal.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-center">
              <motion.div
                animate={status === 'success' ? { scale: [1, 1.8, 1], rotate: [0, 15, -15, 0] } : {}}
                className={`text-8xl md:text-[12rem] font-black leading-none ${status === 'fail' ? 'text-red-500 animate-shake' : 'text-yellow-600'}`}
              >
                {animal.char}
              </motion.div>
              <div className="text-4xl md:text-6xl font-black text-gray-400">is for</div>
              <div className="text-5xl md:text-9xl font-black text-gray-800 italic">{animal.name}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full mt-10">
        <VirtualKeyboard onKey={processKey} />
      </div>
      
      <div className="mt-8 text-2xl font-black text-gray-400 uppercase tracking-widest animate-pulse">
        Find the {animal.char} key! ⌨️
      </div>
    </div>
  );
};

export default AlphabetZoo;
