
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
          className="text-4xl md:text-7xl font-black text-[#d1fae5] drop-shadow-lg uppercase tracking-widest italic"
        >
          Forest Friends
        </motion.h2>
      </div>

      <div className="relative w-full h-full">
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
                    rotate: [0, -3, 3, 0], 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4 + Math.random(), repeat: Infinity }}
                  whileTap={{ scale: 1.3, rotate: 10 }}
                  onClick={() => handleReveal(spot)}
                  className="text-8xl md:text-[10rem] drop-shadow-xl hover:brightness-110 cursor-pointer"
                >
                  {spot.icon}
                </motion.button>
              ) : (
                <motion.div
                  key={`reveal-${spot.id}`}
                  initial={{ scale: 0, opacity: 0, y: 50 }}
                  animate={{ scale: 1.1, opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-48 h-48 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl clay-card bg-white">
                    <img src={spot.img} alt={spot.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white px-8 py-2 rounded-full shadow-lg border-2 border-emerald-100">
                    <span className="text-2xl md:text-3xl font-black text-emerald-800 uppercase">
                      {spot.name}!
                    </span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRevealed(prev => prev.filter(id => id !== spot.id))}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-full text-lg font-black uppercase shadow-lg clay-btn mt-2"
                  >
                    Hide
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 w-full text-center px-6">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-block bg-white/20 backdrop-blur-md text-white px-10 py-4 rounded-full font-black text-2xl border-2 border-white/20 shadow-xl uppercase italic"
        >
          Tap the objects to find friends! 🔍
        </motion.div>
      </div>
    </div>
  );
};

export default ForestOfMystery;
