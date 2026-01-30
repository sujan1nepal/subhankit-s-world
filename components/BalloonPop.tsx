
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VirtualKeyboard from './VirtualKeyboard.tsx';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

interface Balloon {
  id: number;
  char: string;
  x: number;
  color: string;
  depth: number;
}

const COLORS = [
  'bg-red-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_20px_rgba(239,68,68,0.3)]',
  'bg-blue-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_20px_rgba(59,130,246,0.3)]',
  'bg-green-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_20px_rgba(34,197,94,0.3)]',
  'bg-yellow-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_20px_rgba(250,204,21,0.3)]',
  'bg-purple-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_20px_rgba(168,85,247,0.3)]',
  'bg-pink-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_20px_rgba(236,72,153,0.3)]',
  'bg-orange-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_20px_rgba(251,146,60,0.3)]',
];

const BalloonPop: React.FC<Props> = ({ speak }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const balloonsRef = useRef<Balloon[]>([]);

  // Keep ref in sync for the event listener closure
  useEffect(() => {
    balloonsRef.current = balloons;
  }, [balloons]);

  const spawnBalloon = useCallback(() => {
    const char = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const newBalloon: Balloon = {
      id: Date.now() + Math.random(),
      char,
      x: 10 + Math.random() * 80,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      depth: Math.random() * 100
    };
    setBalloons(prev => [...prev.slice(-6), newBalloon]);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnBalloon, 2200);
    return () => clearInterval(interval);
  }, [spawnBalloon]);

  const pop = useCallback((id: number, char: string) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    speak(`Pop! ${char}!`);
  }, [speak]);

  const processKey = useCallback((key: string) => {
    const pressed = key.toUpperCase();
    const target = balloonsRef.current.find(b => b.char === pressed);
    if (target) {
      pop(target.id, target.char);
    }
  }, [pop]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => processKey(e.key);
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [processKey]);

  return (
    <div className="w-full h-full bg-sky-50 flex flex-col items-center p-6 perspective-container">
      <h2 className="text-4xl md:text-7xl font-black text-sky-600 z-10 mb-4 uppercase tracking-tighter drop-shadow-md">
        Balloon Pop!
      </h2>

      <div className="flex-grow w-full relative overflow-hidden rounded-[3rem] bg-sky-100/30 border-8 border-white mb-6 shadow-inner">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.div
              key={balloon.id}
              initial={{ y: '110%', opacity: 0, scale: 0.8 }}
              animate={{ y: '-30%', opacity: 1, scale: 1 }}
              exit={{ scale: 4, opacity: 0, rotate: 45 }}
              transition={{ duration: 12, ease: 'linear' }}
              className={`absolute w-24 h-32 md:w-40 md:h-52 rounded-full ${balloon.color} border-4 border-white/40 flex items-center justify-center cursor-pointer active:scale-125 transition-transform z-[${Math.round(balloon.depth)}]`}
              style={{ left: `${balloon.x}%` }}
              onClick={() => pop(balloon.id, balloon.char)}
            >
              <div className="absolute top-2 left-6 w-8 h-10 bg-white/20 rounded-full blur-md" />
              <span className="text-5xl md:text-8xl font-black text-white pointer-events-none select-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
                {balloon.char}
              </span>
              <div className="absolute top-full left-1/2 w-1 h-32 bg-sky-200/40 -translate-x-1/2 pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full z-20">
        <VirtualKeyboard onKey={processKey} />
      </div>
      
      <p className="mt-4 text-sky-800 font-black text-xl uppercase tracking-widest opacity-50">
        Pop the 3D Balloons! 🎈
      </p>
    </div>
  );
};

export default BalloonPop;
