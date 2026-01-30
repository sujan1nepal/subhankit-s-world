
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const ForestOfMystery: React.FC<Props> = ({ speak }) => {
  const [revealed, setRevealed] = useState<number[]>([]);

  const hidingSpots = [
    { id: 1, name: 'Dinosaur', icon: '🌿', img: 'https://images.unsplash.com/photo-1517930410339-01e350335e5a?w=600&q=80', message: 'Look! A Dinosaur!', x: '20%', y: '25%' },
    { id: 2, name: 'Unicorn', icon: '🪨', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80', message: 'Magic! A Unicorn!', x: '50%', y: '20%' },
    { id: 3, name: 'Puppy', icon: '☁️', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80', message: 'Aww! A fluffy puppy!', x: '80%', y: '25%' },
    { id: 4, name: 'Monkey', icon: '🌳', img: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&q=80', message: 'Hahaha! A silly monkey!', x: '35%', y: '60%' },
    { id: 5, name: 'Elephant', icon: '🍄', img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&q=80', message: 'Wow! A big elephant!', x: '65%', y: '65%' },
    { id: 6, name: 'Teddy Bear', icon: '🧺', img: 'https://images.unsplash.com/photo-1559440666-374193688f17?w=600&q=80', message: 'So cozy! A Teddy Bear!', x: '15%', y: '75%' },
  ];

  const handleReveal = (spot: typeof hidingSpots[0]) => {
    if (!revealed.includes(spot.id)) {
      setRevealed([...revealed, spot.id]);
      speak(spot.message);
    }
  };

  return (
    <div className="w-full h-full bg-[#064e3b] relative overflow-hidden perspective-container">
      <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b] via-[#065f46] to-transparent opacity-60" />
      
      <div className="absolute top-10 w-full text-center z-10 px-4">
        <motion.h2 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-8xl font-black text-[#d1fae5] drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] uppercase tracking-widest italic"
        >
          Forest of Mystery
        </motion.h2>
      </div>

      <div className="relative w-full h-full p-4">
        {hidingSpots.map(spot => (
          <div 
            key={spot.id} 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: spot.x, top: spot.y }}
          >
            <AnimatePresence mode="wait">
              {!revealed.includes(spot.id) ? (
                <motion.button
                  key={`hide-${spot.id}`}
                  initial={{ scale: 1 }}
                  animate={{ 
                    rotate: [0, -5, 5, 0], 
                    scale: [1, 1.15, 1],
                  }}
                  transition={{ duration: 4 + Math.random(), repeat: Infinity }}
                  whileTap={{ scale: 1.4, rotate: 20 }}
                  onClick={() => handleReveal(spot)}
                  className="text-[10rem] md:text-[18rem] drop-shadow-[25px_25px_40px_rgba(0,0,0,0.5)] hover:brightness-125 cursor-pointer filter grayscale-[0.2]"
                >
                  {spot.icon}
                </motion.button>
              ) : (
                <motion.div
                  key={`reveal-${spot.id}`}
                  initial={{ scale: 0, opacity: 0, y: 100, rotate: -30 }}
                  animate={{ scale: 1.2, opacity: 1, y: 0, rotate: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="w-64 h-64 md:w-96 md:h-96 rounded-[4rem] overflow-hidden border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] clay-card bg-white">
                    <img src={spot.img} alt={spot.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white/95 backdrop-blur-md px-10 py-3 rounded-[3rem] shadow-2xl border-4 border-emerald-200">
                    <span className="text-3xl md:text-5xl font-black text-emerald-900 uppercase tracking-tighter">
                      {spot.name}!
                    </span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRevealed(prev => prev.filter(id => id !== spot.id))}
                    className="bg-emerald-500 text-white px-8 py-3 rounded-full text-xl font-black uppercase tracking-widest shadow-xl clay-btn"
                  >
                    Hide Again
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 w-full text-center px-6">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-block bg-white/20 backdrop-blur-2xl text-white px-12 py-6 rounded-[3rem] font-black text-3xl border-4 border-white/20 shadow-2xl uppercase tracking-widest"
        >
          Can you find the hidden friends? 🔍
        </motion.div>
      </div>
    </div>
  );
};

export default ForestOfMystery;
