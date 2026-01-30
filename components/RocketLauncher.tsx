
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const RocketLauncher: React.FC<Props> = ({ speak }) => {
  const [targetChar, setTargetChar] = useState('');
  const [launched, setLaunched] = useState(false);

  const generateTarget = useCallback(() => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const newTarget = chars[Math.floor(Math.random() * chars.length)];
    setTargetChar(newTarget);
    speak(`Find the ${newTarget} key on your keyboard to launch!`);
  }, [speak]);

  useEffect(() => {
    generateTarget();
  }, [generateTarget]);

  const handleLaunch = useCallback(() => {
    setLaunched(true);
    speak(`WOW! BLAST OFF!`);
    confetti({
      particleCount: 300,
      spread: 120,
      origin: { y: 0.8 },
      colors: ['#ff4500', '#ffa500', '#ffeb3b', '#ffffff']
    });
    setTimeout(() => {
      setLaunched(false);
      generateTarget();
    }, 4500);
  }, [speak, generateTarget]);

  const processKey = useCallback((key: string) => {
    if (launched) return;
    const pressed = key.toUpperCase();
    if (pressed === targetChar) {
      handleLaunch();
    } else if (pressed.length === 1 && /^[A-Z0-9]$/.test(pressed)) {
      speak(`Not that one. Try to find the ${targetChar} key!`);
    }
  }, [targetChar, launched, handleLaunch, speak]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => processKey(e.key);
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [processKey]);

  return (
    <div className="w-full h-full bg-[#020617] relative overflow-hidden flex flex-col items-center p-6 perspective-container">
      {/* Dynamic 3D Space Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.1, 1, 0.1], 
              scale: [1, 1.5, 1],
              z: [0, 500, 0] 
            }}
            transition={{ 
              duration: 2 + Math.random() * 5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {/* Distant Planet */}
        <div className="absolute top-20 right-20 w-48 h-48 bg-orange-900/30 rounded-full blur-3xl border border-orange-500/20" />
      </div>

      <div className="z-10 text-center shrink-0 mb-8">
        <h2 className="text-5xl md:text-8xl font-black text-indigo-400 italic uppercase tracking-widest drop-shadow-[0_10px_30px_rgba(129,140,248,0.6)]">
          SPACE ADVENTURE
        </h2>
        <div className="mt-4 bg-indigo-500/20 backdrop-blur-md px-10 py-3 rounded-full border-2 border-indigo-400/30">
          <p className="text-indigo-300 font-black text-2xl uppercase tracking-[0.2em] italic">
            TYPE ON YOUR KEYBOARD! ⌨️
          </p>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center z-10 w-full relative min-h-0">
        <AnimatePresence mode="wait">
          {!launched ? (
            <motion.div
              key="target"
              initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 2, rotateY: 90 }}
              className="flex flex-col items-center"
            >
              <div className="text-[18rem] md:text-[30rem] font-black text-white drop-shadow-[0_0_60px_rgba(129,140,248,1)] leading-none select-none italic">
                {targetChar}
              </div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl font-black text-indigo-200 mt-8 uppercase bg-indigo-900/80 px-16 py-6 rounded-[3rem] border-4 border-indigo-400 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
              >
                Press "{targetChar}"!
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="rocket"
              initial={{ y: 500, scale: 1, rotateX: 0 }}
              animate={{ y: -2000, scale: [1, 1.8, 0.1], rotateX: [0, -30, -60] }}
              transition={{ duration: 3.5, ease: "easeIn" }}
              className="relative preserve-3d"
            >
              {/* Enhanced 3D Rocket */}
              <div className="w-48 h-80 md:w-72 md:h-[35rem] flex flex-col items-center">
                {/* Nose Cone */}
                <div className="w-0 h-0 border-l-[48px] border-r-[48px] md:border-l-[72px] border-r-[72px] border-b-[100px] md:border-b-[150px] border-b-red-500 rounded-t-full drop-shadow-2xl" />
                
                {/* Body */}
                <div className="w-48 h-64 md:w-72 md:h-96 bg-slate-50 rounded-[3rem] shadow-[inset_-25px_0_50px_rgba(0,0,0,0.15),25px_15px_50px_rgba(0,0,0,0.6)] border-x-8 border-slate-200 relative overflow-hidden">
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-24 h-24 md:w-36 md:h-36 bg-sky-300 rounded-full border-8 border-slate-400 shadow-inner flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-sky-200/50 rounded-full blur-xl" />
                  </div>
                  {/* Decorative stripes */}
                  <div className="absolute bottom-12 w-full h-8 bg-red-400/80" />
                  <div className="absolute bottom-24 w-full h-6 bg-blue-400/80" />
                </div>
                
                {/* Fins & Engine */}
                <div className="flex gap-3 w-full -mt-6 relative z-20 px-2">
                  <div className="flex-1 h-24 md:h-40 bg-red-600 rounded-bl-[5rem] shadow-2xl border-l-4 border-red-700" />
                  <div className="w-2/3 h-16 md:h-20 bg-slate-600 rounded-b-[2rem] border-x-4 border-slate-700" />
                  <div className="flex-1 h-24 md:h-40 bg-red-600 rounded-br-[5rem] shadow-2xl border-r-4 border-red-700" />
                </div>
                
                {/* Massive 3D Engine Flames */}
                <motion.div
                  animate={{ 
                    scaleY: [1, 3.5, 2, 5, 1],
                    scaleX: [1, 1.3, 0.8, 1.2, 1],
                    opacity: [0.8, 1, 0.8] 
                  }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                  className="w-40 md:w-56 h-80 md:h-[30rem] bg-gradient-to-t from-transparent via-orange-600 to-yellow-300 absolute top-[85%] left-1/2 -translate-x-1/2 blur-3xl -z-10 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 w-full text-center px-10 pointer-events-none">
        <p className="text-indigo-400 font-bold uppercase tracking-[0.5em] opacity-40">
          Ready for ignition...
        </p>
      </div>
    </div>
  );
};

export default RocketLauncher;
