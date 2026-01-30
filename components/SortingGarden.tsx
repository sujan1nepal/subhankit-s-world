
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
}

const SHAPE_ICONS = {
  circle: <Circle size={64} fill="currentColor" />,
  square: <Square size={64} fill="currentColor" />,
  triangle: <Triangle size={64} fill="currentColor" />
};

const BORDER_CLASSES: Record<string, string> = {
  red: 'border-red-400 text-red-500',
  blue: 'border-blue-400 text-blue-500',
  green: 'border-green-400 text-green-500',
  yellow: 'border-yellow-400 text-yellow-600',
  purple: 'border-purple-400 text-purple-500',
  orange: 'border-orange-400 text-orange-500',
};

const FILL_CLASSES: Record<string, string> = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  yellow: 'text-yellow-600',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
};

const SortingGarden: React.FC<Props> = ({ speak }) => {
  const [level, setLevel] = useState(1);
  const [items, setItems] = useState<GardenItem[]>([]);
  const [activeTargets, setActiveTargets] = useState<any[]>([]);

  const generateLevel = useCallback((lvl: number) => {
    const config = lvl <= 2 ? { bins: 2, count: 4 } : lvl <= 5 ? { bins: 3, count: 6 } : { bins: 4, count: 8 };
    const types: ShapeType[] = ['circle', 'square', 'triangle'];
    const colors: ColorType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    
    const targets = [];
    for (let i = 0; i < config.bins; i++) {
      targets.push({
        type: types[i % types.length],
        color: colors[Math.floor(Math.random() * colors.length)],
        id: `target-${lvl}-${i}`
      });
    }

    const newItems: GardenItem[] = [];
    for (let i = 0; i < config.count; i++) {
      const target = targets[i % targets.length];
      newItems.push({
        id: Math.random(),
        type: target.type,
        color: target.color,
      });
    }

    setActiveTargets(targets);
    setItems(newItems.sort(() => Math.random() - 0.5));
    speak(`Find the right basket!`);
  }, [speak]);

  useEffect(() => {
    generateLevel(level);
  }, [level, generateLevel]);

  const handleDragEnd = (event: any, info: any, item: GardenItem) => {
    const dropX = info.point.x;
    const dropY = info.point.y;

    let matched = false;
    activeTargets.forEach(target => {
      const el = document.getElementById(target.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom) {
          if (item.type === target.type && item.color === target.color) {
            matched = true;
          }
        }
      }
    });

    if (matched) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      speak(`Good job!`);
      confetti({ 
        particleCount: 50, 
        spread: 60, 
        origin: { x: dropX / window.innerWidth, y: dropY / window.innerHeight }
      });
    }
  };

  return (
    <div className="w-full h-full bg-[#f0fdf4] flex flex-col items-center p-4 overflow-hidden">
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 shrink-0 mt-2">
        <h2 className="text-4xl md:text-6xl font-black text-green-700 drop-shadow-sm uppercase">Shape Sort</h2>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => generateLevel(level)} 
          className="p-4 bg-white text-green-600 rounded-3xl shadow-xl clay-btn"
        >
          <RefreshCcw size={32} />
        </motion.button>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-12 w-full max-w-6xl shrink-0">
        {activeTargets.map(t => (
          <div
            key={t.id}
            id={t.id}
            className={`w-32 h-40 md:w-52 md:h-64 rounded-[3rem] border-8 border-dashed flex flex-col items-center justify-center p-4 clay-card transition-colors ${BORDER_CLASSES[t.color]}`}
          >
            <div className="mb-4 scale-150">{SHAPE_ICONS[t.type as ShapeType]}</div>
            <span className="font-black uppercase text-xl tracking-widest">{t.color}</span>
          </div>
        ))}
      </div>

      <div className="flex-grow w-full max-w-6xl flex flex-wrap gap-6 justify-center items-center content-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.div
              key={item.id}
              drag
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(e, info, item)}
              whileHover={{ scale: 1.2, zIndex: 100 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`w-24 h-24 md:w-32 md:h-32 cursor-grab active:cursor-grabbing bg-white rounded-3xl shadow-xl border-4 border-green-50 flex items-center justify-center touch-none clay-btn ${FILL_CLASSES[item.color]}`}
            >
              {SHAPE_ICONS[item.type]}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center z-[100]"
          >
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }} 
              className="bg-white p-12 rounded-[4rem] text-center shadow-2xl clay-card border-8 border-green-400"
            >
              <h3 className="text-6xl font-black text-green-600 mb-8 uppercase">Hooray!</h3>
              <button 
                onClick={() => setLevel(level + 1)} 
                className="px-10 py-5 bg-green-500 text-white rounded-full font-black text-3xl shadow-xl clay-btn flex items-center gap-3"
              >
                Level {level + 1} <ArrowRight size={40} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortingGarden;
