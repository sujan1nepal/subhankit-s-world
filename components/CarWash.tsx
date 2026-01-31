
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Sparkles, ChevronRight } from 'lucide-react';
import { WashItem } from '../types.ts';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
  items: WashItem[];
}

const CarWash: React.FC<Props> = ({ speak, items }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);

  const currentItem = items[itemIndex] || items[0];

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset and fill with mud
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#6d4c41'; // Muddy brown
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some "clumps" of mud
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = '#3e2723';
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width, 
        Math.random() * canvas.height, 
        20 + Math.random() * 60, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
    }
    
    setIsDone(false);
    speak(`Oh no! The ${currentItem?.name} is so muddy! Can you wash it?`);
  }, [speak, currentItem]);

  useEffect(() => {
    initCanvas();
  }, [itemIndex, initCanvas]);

  const scrub = (x: number, y: number) => {
    if (isDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Erase mud
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 75, 0, Math.PI * 2);
    ctx.fill();

    // Check completion randomly to save performance
    if (Math.random() > 0.9) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let muddyPixels = 0;
      // Sample every 50th pixel to check opacity
      for (let i = 3; i < imageData.length; i += 200) {
        if (imageData[i] > 0) muddyPixels++;
      }
      
      if (muddyPixels < 15) {
        setIsDone(true);
        speak(`Yay! Look at that shiny ${currentItem.name}!`);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (800 / rect.width);
    const y = (e.clientY - rect.top) * (600 / rect.height);
    scrub(x, y);
  };

  const nextItem = () => {
    setItemIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="w-full h-full bg-sky-50 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 pr-40">
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextItem}
            className="bg-white px-8 py-3 rounded-3xl font-black text-blue-500 shadow-xl clay-btn flex items-center gap-2 border-b-4 border-blue-100"
          >
            NEXT <ChevronRight />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={initCanvas}
            className="bg-blue-500 p-4 text-white rounded-3xl shadow-xl clay-btn"
          >
            <RefreshCcw size={28} />
          </motion.button>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black text-blue-600 drop-shadow-sm flex items-center gap-3">
          <Sparkles size={48} className="text-yellow-400" /> Wash & Spa
        </h2>
      </div>
      
      <div className="relative w-full max-w-3xl aspect-[4/3] bg-white rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-white touch-none clay-card">
        {/* Background Item Container */}
        <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center ${currentItem?.color} transition-colors duration-500`}>
          <span className="text-[12rem] md:text-[20rem] drop-shadow-2xl filter brightness-110">
            {currentItem?.icon}
          </span>
          <div className="bg-white/30 backdrop-blur-md px-10 py-2 rounded-full mt-4 border border-white/40">
            <span className="text-4xl md:text-5xl font-black text-white uppercase drop-shadow-md">
              {currentItem?.name}
            </span>
          </div>
        </div>
        
        {/* Mud Layer */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="absolute inset-0 w-full h-full cursor-pointer active:cursor-grabbing opacity-90 transition-opacity"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
        />

        <AnimatePresence>
          {isDone && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-blue-400/20 backdrop-blur-sm pointer-events-none"
            >
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1.2, rotate: 0 }}
                className="bg-white/95 p-12 rounded-[4rem] font-black text-6xl text-blue-600 shadow-2xl border-8 border-blue-400 text-center uppercase tracking-tighter"
              >
                SO SHINY! ✨
                <motion.button 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => { e.stopPropagation(); nextItem(); }} 
                  className="block mt-8 text-2xl bg-blue-500 text-white px-12 py-4 rounded-full mx-auto pointer-events-auto shadow-xl clay-btn"
                >
                  CLEAN ANOTHER!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-2xl md:text-3xl font-black text-blue-800 text-center uppercase tracking-widest italic opacity-50">
        Rub away the mud to find the friend! 🧼
      </div>
    </div>
  );
};

export default CarWash;
