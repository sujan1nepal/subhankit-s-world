
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
  const [score, setScore] = useState(0);
  const balloonsRef = useRef<Balloon[]>([]);

  useEffect(() => {
    balloonsRef.current = balloons;
  }, [balloons]);

  const pop = useCallback((id: number, char: string) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
    speak(`Pop! ${char}!`);
  }, [speak]);

  const spawnBalloon = useCallback(() => {
    const char = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const newBalloon: Balloon = {
      id: Date.now() + Math.random(),
      char,
      x: 5 + Math.random() * 85,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      depth: Math.random() * 100,
      speed: 10 + Math.random() * 8
    };
    setBalloons(prev => [...prev.slice(-15), newBalloon]);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnBalloon, 1300);
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
      <div className="z-10 w-full max-w-7xl flex justify-between items-center mb-4 shrink-0 px-6">
        <div className="text-left">
          <h2 className="text-4xl md:text-7xl font-black text-sky-600 uppercase tracking-tighter drop-shadow-sm">
            Balloon Pop!
          </h2>
        </div>
        <div className="bg-white/80 p-4 rounded-3xl shadow-xl border-4 border-sky-100 flex items-center gap-4">
          <span className="text-sky-400 text-2xl font-black">SCORE:</span>
          <motion.span 
            key={score}
            initial={{ scale: 1.5, color: '#0ea5e9' }}
            animate={{ scale: 1, color: '#0284c7' }}
            className="text-5xl font-black text-sky-600"
          >
            {score}
          </motion.span>
        </div>
      </div>

      <div className="flex-grow w-full max-w-7xl relative overflow-hidden rounded-[4rem] bg-sky-100/40 border-[16px] border-white shadow-2xl clay-card mb-4">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.div
              key={balloon.id}
              initial={{ y: '120%', opacity: 0, scale: 0.8 }}
              animate={{ y: '-40%', opacity: 1, scale: 1 }}
              exit={{ 
                scale: [1, 3, 4], 
                opacity: 0, 
                rotate: [0, 45],
                transition: { duration: 0.3 } 
              }}
              transition={{ duration: balloon.speed, ease: 'linear' }}
              className={`absolute w-36 h-48 md:w-52 md:h-72 rounded-full ${balloon.color} border-4 border-white/40 flex items-center justify-center cursor-pointer z-[${Math.round(balloon.depth)}] clay-btn`}
              style={{ left: `${balloon.x}%` }}
              onClick={() => pop(balloon.id, balloon.char)}
            >
              <div className="absolute top-4 left-6 w-14 h-18 bg-white/30 rounded-full blur-lg" />
              <span className="text-8xl md:text-[10rem] font-black text-white drop-shadow-lg select-none">
                {balloon.char}
              </span>
              
              {/* Pop Blast Effect Overlay */}
              <AnimatePresence>
                {/* Visual particles on exit are handled by the exit transition above, 
                    but we can add extra flare here */}
              </AnimatePresence>
              
              <div className="absolute top-full left-1/2 w-[3px] h-48 bg-sky-300/40 -translate-x-1/2 pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mb-2 shrink-0 bg-sky-600 px-8 py-2 rounded-full shadow-lg">
        <p className="text-white font-black text-xl uppercase tracking-widest italic">
          Type the letter!
        </p>
      </div>
    </div>
  );
};

export default BalloonPop;
