
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Square, Triangle, RefreshCcw, Star, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

type ShapeType = 'circle' | 'square' | 'triangle';
type ColorType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

interface GardenItem {
  id: number;
  type: ShapeType;
  color: ColorType;
  img: string;
}

const ALL_IMAGES: Record<string, string> = {
  'red-circle': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80', // Apple
  'blue-square': 'https://images.unsplash.com/photo-1497514440240-3b870f7341f0?w=400&q=80', // Blueberry context
  'green-triangle': 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&q=80', // Broccoli
  'yellow-circle': 'https://images.unsplash.com/photo-1568569350062-ebad3d17609c?w=400&q=80', // Lemon
  'purple-square': 'https://images.unsplash.com/photo-1537640538966-79f369b41f8f?w=400&q=80', // Grapes
  'orange-circle': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80', // Orange
  'red-triangle': 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&q=80', // Strawberry
  'blue-circle': 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?w=400&q=80', // Blue items
  'green-square': 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&q=80', // Asparagus/Veg
  'yellow-triangle': 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&q=80', // Banana
  'purple-circle': 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=400&q=80', // Plum-ish
  'orange-square': 'https://images.unsplash.com/photo-1597362804323-380d604e2862?w=400&q=80', // Pumpkin
  'red-square': 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?w=400&q=80', // Tomato
  'green-circle': 'https://images.unsplash.com/photo-1550258114-b0d2475b5394?w=400&q=80', // Lime/Pear
  'blue-triangle': 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&q=80', // Sailboat/Blue
};

const SHAPE_ICONS = {
  circle: <Circle size={32} />,
  square: <Square size={32} />,
  triangle: <Triangle size={32} />
};

const SortingGarden: React.FC<Props> = ({ speak }) => {
  const [level, setLevel] = useState(1);
  const [items, setItems] = useState<GardenItem[]>([]);
  const [activeTargets, setActiveTargets] = useState<any[]>([]);

  const generateLevel = useCallback((lvl: number) => {
    const configs = [
      { bins: 1, items: 3 }, { bins: 1, items: 4 }, { bins: 2, items: 4 },
      { bins: 2, items: 6 }, { bins: 3, items: 6 }, { bins: 3, items: 9 },
      { bins: 4, items: 8 }, { bins: 4, items: 12 }, { bins: 5, items: 10 }, { bins: 5, items: 15 },
    ];

    const config = configs[Math.min(lvl - 1, configs.length - 1)];
    const types: ShapeType[] = ['circle', 'square', 'triangle'];
    const colors: ColorType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    
    const selectedTargets = [];
    for (let i = 0; i < config.bins; i++) {
      let type = types[i % types.length];
      let color = colors[i % colors.length];
      selectedTargets.push({
        type,
        color,
        label: `${color}`,
        icon: SHAPE_ICONS[type]
      });
    }

    const newItems: GardenItem[] = [];
    for (let i = 0; i < config.items; i++) {
      const target = selectedTargets[i % selectedTargets.length];
      const key = `${target.color}-${target.type}`;
      newItems.push({
        id: Math.random(),
        type: target.type,
        color: target.color,
        img: ALL_IMAGES[key] || 'https://images.unsplash.com/photo-1553272725-086100aecf5e?w=400&q=80'
      });
    }

    setActiveTargets(selectedTargets);
    setItems(newItems.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateLevel(level);
  }, [level, generateLevel]);

  const handleDragEnd = (event: any, info: any, item: GardenItem) => {
    const targetId = `target-${item.color}-${item.type}`;
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const targetRect = targetElement.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;

    if (
      dropX > targetRect.left && dropX < targetRect.right &&
      dropY > targetRect.top && dropY < targetRect.bottom
    ) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      speak(`Great sorting! That's the ${item.color} one!`);
      confetti({ 
        particleCount: 25, 
        spread: 40, 
        origin: { x: dropX / window.innerWidth, y: dropY / window.innerHeight } 
      });
    }
  };

  const nextLevel = () => {
    if (level < 10) {
      setLevel(level + 1);
      speak(`Level ${level + 1}! Let's find more colorful things!`);
    } else {
      setLevel(1);
      speak("Wonderful work! You are a master sorter! Let's play again!");
    }
  };

  const COLOR_MAP: Record<string, string> = {
    red: 'text-red-600 border-red-200 bg-red-50',
    blue: 'text-blue-600 border-blue-200 bg-blue-50',
    green: 'text-green-600 border-green-200 bg-green-50',
    yellow: 'text-yellow-600 border-yellow-200 bg-yellow-50',
    purple: 'text-purple-600 border-purple-200 bg-purple-50',
    orange: 'text-orange-600 border-orange-200 bg-orange-50',
  };

  return (
    <div className="w-full h-full bg-[#f0fdf4] flex flex-col items-center overflow-y-auto p-8 perspective-container">
      <div className="w-full max-w-5xl flex justify-between items-center mb-10 z-20">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-green-700 drop-shadow-md">Garden Sort</h2>
          <div className="flex items-center gap-3 text-yellow-600 font-black text-2xl mt-2">
            <Star size={32} fill="currentColor" /> Level {level} / 10
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => generateLevel(level)}
          className="p-5 bg-white text-green-600 rounded-[2rem] shadow-xl border-4 border-green-200 transition-all duration-700 clay-btn"
        >
          <RefreshCcw size={32} />
        </motion.button>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl mb-16">
        {activeTargets.map(t => (
          <div
            key={`${t.color}-${t.type}`}
            id={`target-${t.color}-${t.type}`}
            className={`border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center p-8 shadow-inner min-w-[180px] min-h-[220px] transition-all clay-card ${COLOR_MAP[t.color] || 'border-green-300 bg-white'}`}
          >
            <div className="mb-4 scale-150">{t.icon}</div>
            <span className="font-black uppercase text-xl tracking-widest text-center">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-grow flex flex-wrap gap-10 justify-center items-center content-center max-w-5xl pb-16">
        <AnimatePresence>
          {items.map(item => (
            <motion.div
              key={item.id}
              drag
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(e, info, item)}
              whileHover={{ scale: 1.2, zIndex: 50, rotate: 5 }}
              whileTap={{ scale: 0.9, zIndex: 100 }}
              className="w-32 h-32 md:w-44 md:h-44 cursor-grab active:cursor-grabbing p-2 bg-white rounded-[2.5rem] shadow-2xl border-4 border-green-100 flex items-center justify-center touch-none overflow-hidden clay-btn"
            >
              <img src={item.img} alt="Garden item" className="w-full h-full object-cover rounded-2xl" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 bg-green-900/40 backdrop-blur-xl flex items-center justify-center z-[100] p-6"
          >
            <div className="bg-white p-12 rounded-[4rem] text-center shadow-2xl border-8 border-green-400 max-w-md w-full clay-card">
              <div className="text-9xl mb-8">🌟</div>
              <h3 className="text-5xl font-black text-green-600 mb-2">Level {level}</h3>
              <p className="text-3xl font-bold text-gray-500 mb-10 uppercase tracking-widest">Complete!</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextLevel} 
                className="w-full py-6 bg-green-500 text-white text-4xl font-black rounded-[2.5rem] shadow-2xl hover:bg-green-600 flex items-center justify-center gap-4 clay-btn"
              >
                {level === 10 ? 'Start Over' : 'Next Level'} <ArrowRight size={48} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortingGarden;
