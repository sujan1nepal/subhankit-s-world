
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  speed: number;
}

const COLORS = [
  'bg-red-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_30px_rgba(239,68,68,0.4)]',
  'bg-blue-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_30px_rgba(59,130,246,0.4)]',
  'bg-green-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_30px_rgba(34,197,94,0.4)]',
  'bg-yellow-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_30px_rgba(250,204,21,0.4)]',
  'bg-purple-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_30px_rgba(168,85,247,0.4)]',
  'bg-pink-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_30px_rgba(236,72,153,0.4)]',
  'bg-orange-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),10px_10px_30px_rgba(251,146,60,0.4)]',
];

const BalloonPop: React.FC<Props> = ({ speak }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const balloonsRef = useRef<Balloon[]>([]);

  useEffect(() => {
    balloonsRef.current = balloons;
  }, [balloons]);

  const pop = useCallback((id: number, char: string) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    speak(`Pop! ${char}!`);
  }, [speak]);

  const spawnBalloon = useCallback(() => {
    const char = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const newBalloon: Balloon = {
      id: Date.now() + Math.random(),
      char,
      x: 10 + Math.random() * 80,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      depth: Math.random() * 100,
      speed: 10 + Math.random() * 8
    };
    setBalloons(prev => [...prev.slice(-15), newBalloon]);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnBalloon, 1400);
    return () => clearInterval(interval);
  }, [spawnBalloon]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const pressed = e.key.toUpperCase();
      const target = balloonsRef.current.find(b => b.char === pressed);
      if (target) {
        pop(target.id, target.char);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [pop]);

  return (
    <div className="w-full h-full bg-sky-50 flex flex-col items-center p-4 overflow-hidden">
      <div className="z-10 text-center mb-4 shrink-0 mt-2">
        <h2 className="text-4xl md:text-7xl font-black text-sky-600 uppercase tracking-tighter drop-shadow-sm">
          Balloon Pop!
        </h2>
        <div className="mt-1 bg-white/70 backdrop-blur-md px-8 py-2 rounded-full border border-sky-200 shadow-sm inline-block">
          <p className="text-sky-800 font-black text-lg md:text-xl uppercase tracking-widest">
            Type the letter to pop! 🎈
          </p>
        </div>
      </div>

      <div className="flex-grow w-full relative overflow-hidden rounded-[3rem] bg-sky-100/40 border-[12px] border-white shadow-2xl clay-card mb-4">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.div
              key={balloon.id}
              initial={{ y: '120%', opacity: 0, scale: 0.8 }}
              animate={{ y: '-40%', opacity: 1, scale: 1 }}
              exit={{ 
                scale: [1, 2.5], 
                opacity: 0, 
                rotate: [0, 20],
                transition: { duration: 0.2 } 
              }}
              transition={{ duration: balloon.speed, ease: 'linear' }}
              className={`absolute w-32 h-44 md:w-48 md:h-64 rounded-full ${balloon.color} border-4 border-white/40 flex items-center justify-center cursor-pointer z-[${Math.round(balloon.depth)}] clay-btn`}
              style={{ left: `${balloon.x}%` }}
              onClick={() => pop(balloon.id, balloon.char)}
            >
              <div className="absolute top-4 left-6 w-12 h-16 bg-white/30 rounded-full blur-lg" />
              <span className="text-7xl md:text-9xl font-black text-white drop-shadow-lg select-none">
                {balloon.char}
              </span>
              {/* Blast Effect - Internal particles that appear on exit */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                exit={{ opacity: 1 }}
              >
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full translate-x-10 translate-y-10" />
                <div className="absolute top-1/2 left-0 w-4 h-4 bg-white rounded-full -translate-x-10" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full" />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center gap-4 mb-2">
        <div className="w-5 h-5 rounded-full bg-red-400 animate-bounce" />
        <div className="w-5 h-5 rounded-full bg-blue-400 animate-bounce delay-100" />
        <div className="w-5 h-5 rounded-full bg-green-400 animate-bounce delay-200" />
      </div>
    </div>
  );
};

export default BalloonPop;
