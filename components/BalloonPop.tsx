
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

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
];

const BalloonPop: React.FC<Props> = ({ speak }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const balloonsRef = useRef<Balloon[]>([]);

  const GOAL_PER_LEVEL = 10;

  useEffect(() => {
    balloonsRef.current = balloons;
  }, [balloons]);

  const pop = useCallback((id: number, char: string) => {
    if (levelComplete) return;
    
    setBalloons(prev => prev.filter(b => b.id !== id));
    const newScore = score + 1;
    setScore(newScore);
    speak(char);

    if (newScore >= level * GOAL_PER_LEVEL) {
      completeLevel();
    }
  }, [score, level, levelComplete, speak]);

  const completeLevel = () => {
    setLevelComplete(true);
    speak(`Hooray! You finished Level ${level}! You are a winner!`);
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6 }
    });
  };

  const startNextLevel = () => {
    setLevelComplete(false);
    setLevel(prev => prev + 1);
    setBalloons([]);
  };

  const spawnBalloon = useCallback(() => {
    if (levelComplete) return;
    
    // Difficulty Scaling
    // Level 1: Max 3 balloons, Level 5: Max 7 balloons
    const maxBalloons = Math.min(10, 2 + level);
    if (balloonsRef.current.length >= maxBalloons) return;

    const char = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    
    // Speed Scaling
    // Level 1: 25-30s (very slow), Level 5: 15-20s
    const baseSpeed = Math.max(10, 30 - (level * 2.5));
    const speedVariation = 5;

    const newBalloon: Balloon = {
      id: Date.now() + Math.random(),
      char,
      x: 10 + Math.random() * 80,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      depth: Math.random() * 10,
      speed: baseSpeed + (Math.random() * speedVariation)
    };
    setBalloons(prev => [...prev, newBalloon]);
  }, [level, levelComplete]);

  useEffect(() => {
    // Spawn Interval Scaling
    // Level 1: 4s, Level 5: 2s
    const spawnRate = Math.max(1500, 4500 - (level * 500));
    const interval = setInterval(spawnBalloon, spawnRate);
    return () => clearInterval(interval);
  }, [spawnBalloon, level]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const pressed = e.key.toUpperCase();
      const target = balloonsRef.current.find(b => b.char === pressed);
      if (target) pop(target.id, target.char);
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [pop]);

  return (
    <div className="w-full h-full bg-sky-50 flex flex-col items-center p-4 overflow-hidden relative">
      <div className="z-10 w-full max-w-7xl flex justify-between items-center mb-4 px-10">
        <div className="bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 border-b-4 border-sky-100">
           <span className="text-sky-500 font-black text-2xl">LEVEL {level}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-sky-600 uppercase tracking-tighter drop-shadow-sm">
          Balloon Pop!
        </h2>
        {/* Placeholder for header balance */}
        <div className="w-[120px] hidden md:block"></div>
      </div>

      <div className="flex-grow w-full max-w-7xl relative overflow-hidden rounded-[3rem] bg-sky-100/30 border-[12px] border-white shadow-xl clay-card">
        <AnimatePresence>
          {!levelComplete && balloons.map(balloon => (
            <motion.div
              key={balloon.id}
              initial={{ y: '120%', opacity: 0 }}
              animate={{ y: '-40%', opacity: 1 }}
              exit={{ scale: 4, opacity: 0, transition: { duration: 0.2 } }}
              onAnimationComplete={() => {
                // Remove balloon from state once it leaves the screen to free up maxBalloons slot
                setBalloons(prev => prev.filter(b => b.id !== balloon.id));
              }}
              transition={{ duration: balloon.speed, ease: 'linear' }}
              className={`absolute w-32 h-44 md:w-48 md:h-64 rounded-full ${balloon.color} border-4 border-white/30 flex items-center justify-center cursor-pointer clay-btn`}
              style={{ left: `${balloon.x}%` }}
              onClick={() => pop(balloon.id, balloon.char)}
            >
              <span className="text-6xl md:text-8xl font-black text-white drop-shadow-lg select-none">
                {balloon.char}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Score Card in Bottom Right */}
        <div className="absolute bottom-8 right-8 z-20 pointer-events-none">
          <motion.div 
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white px-8 py-4 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border-4 border-yellow-200 clay-card pointer-events-auto"
          >
             <Trophy className="text-yellow-400" size={40} />
             <div className="flex flex-col">
               <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Score</span>
               <span className="text-sky-600 font-black text-4xl leading-none">{score}</span>
             </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {levelComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-sky-500/20 backdrop-blur-md z-50"
            >
              <div className="bg-white p-12 rounded-[4rem] text-center shadow-2xl clay-card border-8 border-yellow-400">
                <Star className="text-yellow-400 mx-auto mb-6 fill-yellow-400" size={100} />
                <h3 className="text-6xl font-black text-sky-600 mb-2 uppercase">WINNER!</h3>
                <p className="text-2xl font-bold text-slate-500 mb-8 uppercase tracking-widest">Level {level} Complete!</p>
                <div className="text-4xl font-black text-yellow-500 mb-10">Score: {score}</div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={startNextLevel}
                  className="px-12 py-6 bg-sky-500 text-white rounded-full font-black text-3xl shadow-xl clay-btn flex items-center gap-4 mx-auto"
                >
                  NEXT LEVEL <ArrowRight size={40} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 mb-4 text-center">
        <p className="text-sky-400 font-black uppercase tracking-[0.3em] text-sm italic">
          Pop {Math.max(0, level * GOAL_PER_LEVEL - score)} more to win!
        </p>
      </div>
    </div>
  );
};

export default BalloonPop;
