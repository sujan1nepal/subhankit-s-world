
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import VirtualKeyboard from './VirtualKeyboard.tsx';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const DUCK_IMAGE = 'https://images.unsplash.com/photo-1555854817-2b214be2eff2?w=400&q=80';

const NumberPark: React.FC<Props> = ({ speak }) => {
  const [targetNum, setTargetNum] = useState(1);
  const [objects, setObjects] = useState<number[]>([]);

  const generateChallenge = () => {
    const num = Math.floor(Math.random() * 9) + 1;
    setTargetNum(num);
    setObjects(Array.from({ length: num }, (_, i) => i));
    speak(`Let's count the fluffy ducks together! How many ducks can you see?`);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const processKey = (key: string) => {
    const num = parseInt(key);
    if (num === targetNum) {
      handleSuccess();
    } else if (!isNaN(num)) {
      speak(`Not ${num}. Let's count them one by one. 1, 2, 3... can you find ${targetNum}?`);
    }
  };

  const handleSuccess = () => {
    speak(`Yes! That's exactly ${targetNum} ducks! You are so good at counting!`);
    confetti({ 
      particleCount: 150, 
      spread: 80, 
      origin: { y: 0.7 },
      colors: ['#a855f7', '#d8b4fe', '#ffffff']
    });
    setTimeout(generateChallenge, 4000);
  };

  return (
    <div className="w-full h-full bg-[#f5f3ff] flex flex-col items-center p-8 perspective-container">
      <h2 className="text-4xl md:text-7xl font-black text-purple-600 mb-10 drop-shadow-md">Number Park</h2>

      <div className="flex-grow w-full max-w-6xl bg-white rounded-[4rem] shadow-2xl border-8 border-purple-200 p-12 flex flex-wrap justify-center items-center gap-8 overflow-hidden clay-card">
        <AnimatePresence>
          {objects.map((id) => (
            <motion.div
              key={id}
              initial={{ scale: 0, rotate: -45, y: 50 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: id * 0.1 }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-purple-100 p-2 bg-white clay-btn cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => speak(String(id + 1))}
            >
              <img src={DUCK_IMAGE} alt="duck" className="w-full h-full object-cover rounded-3xl" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-purple-500/20">
                <span className="text-white text-6xl font-black drop-shadow-lg">{id + 1}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-12 w-full flex flex-col items-center gap-6">
        <p className="text-purple-900 text-3xl font-black uppercase tracking-widest italic opacity-70">How many ducks? Tap the number:</p>
        <VirtualKeyboard type="numbers" onKey={processKey} />
      </div>
    </div>
  );
};

export default NumberPark;
