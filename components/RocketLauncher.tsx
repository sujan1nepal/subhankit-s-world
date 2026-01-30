
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import VirtualKeyboard from './VirtualKeyboard.tsx';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const RocketLauncher: React.FC<Props> = ({ speak }) => {
  const [targetChar, setTargetChar] = useState('');
  const [launched, setLaunched] = useState(false);

  const generateTarget = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    const newTarget = chars[Math.floor(Math.random() * chars.length)];
    setTargetChar(newTarget);
    speak(`Press ${newTarget} to launch the rocket!`);
  }, [speak]);

  useEffect(() => {
    generateTarget();
  }, [generateTarget]);

  const handleLaunch = useCallback(() => {
    setLaunched(true);
    speak(`Blast off! Great job!`);
    confetti({
      particleCount: 250,
      spread: 100,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setLaunched(false);
      generateTarget();
    }, 5000);
  }, [speak, generateTarget]);

  const processKey = useCallback((key: string) => {
    if (launched) return;
    const pressed = key.toUpperCase();
    if (pressed === targetChar) {
      handleLaunch();
    } else if (pressed.length === 1) {
      speak(`No, that's not it. Find the ${targetChar}!`);
    }
  }, [targetChar, launched, handleLaunch, speak]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => processKey(e.key);
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [processKey]);

  return (
    <div className="w-full h-full bg-slate-900 relative overflow-hidden flex flex-col items-center p-4">
      {/* Space Background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.2, 1] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3,
              height: Math.random() * 3,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <h2 className="mt-4 text-2xl md:text-4xl font-black text-indigo-400 z-10 italic uppercase tracking-widest">Rocket Launcher</h2>

      <div className="flex-grow flex flex-col items-center justify-center z-10 w-full relative">
        <AnimatePresence mode="wait">
          {!launched ? (
            <motion.div
              key="target-view"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 2, rotate: 10 }}
              className="flex flex-col items-center"
            >
              <div className="text-[10rem] md:text-[14rem] font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] leading-none">
                {targetChar}
              </div>
              <div className="text-2xl font-bold text-indigo-300 mt-4 uppercase animate-pulse">
                Find this key!
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rocket-view"
              initial={{ y: 200, scale: 0.8 }}
              animate={{ y: -1500, scale: [1, 1.3, 0.4] }}
              transition={{ duration: 4, ease: "easeIn" }}
              className="text-[14rem] md:text-[20rem] relative"
            >
              🚀
              <motion.div
                animate={{ scaleY: [1, 2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="w-12 md:w-20 h-40 bg-gradient-to-t from-orange-500 via-yellow-300 to-transparent absolute bottom-0 left-1/2 -translate-x-1/2 -z-10 blur-md"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!launched && (
        <div className="w-full flex flex-col items-center gap-4 mb-4 z-20">
          <VirtualKeyboard type={isNaN(Number(targetChar)) ? 'letters' : 'numbers'} onKey={processKey} />
        </div>
      )}
    </div>
  );
};

export default RocketLauncher;
