
import React, { useState, useRef, useEffect, useCallback } from 'react';
// Added AnimatePresence to the framer-motion import to fix the missing component error
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Sparkles, ChevronRight } from 'lucide-react';
import { CarWashImage } from '../types.ts';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
  images: CarWashImage[];
}

const CarWash: React.FC<Props> = ({ speak, images }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const currentItem = images[imgIndex] || images[0];

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#795548'; // Rich mud color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = '#3e2723';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 80, 0, Math.PI * 2);
      ctx.fill();
    }
    setIsDone(false);
    speak(`Oh no! The ${currentItem?.name} is so muddy!`);
  }, [speak, currentItem]);

  useEffect(() => {
    initCanvas();
  }, [imgIndex, initCanvas]);

  const scrub = (x: number, y: number) => {
    if (isDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 70, 0, Math.PI * 2);
    ctx.fill();

    if (Math.random() > 0.95) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let opacity = 0;
      for (let i = 3; i < pixels.length; i += 1000) {
        if (pixels[i] > 0) opacity++;
      }
      if (opacity < 15) {
        setIsDone(true);
        speak(`Yay! The ${currentItem.name} is super clean!`);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    scrub(x, y);
  };

  const nextImage = () => {
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="w-full h-full bg-blue-50 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-blue-600 drop-shadow-sm flex items-center gap-3">
          <Sparkles size={48} className="text-yellow-400" /> Wash & Spa
        </h2>
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextImage}
            className="bg-white px-8 py-3 rounded-3xl font-black text-blue-500 shadow-xl clay-btn flex items-center gap-2"
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
      </div>
      
      <div className="relative w-full max-w-3xl aspect-[4/3] bg-white rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-white touch-none clay-card perspective-container">
        <img 
          src={currentItem?.url} 
          alt={currentItem?.name} 
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />
        
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
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-blue-400/20 backdrop-blur-sm pointer-events-none"
            >
              <div className="bg-white/95 p-12 rounded-[3.5rem] font-black text-5xl text-blue-600 shadow-2xl border-8 border-blue-400 text-center uppercase tracking-tighter scale-110">
                SHINY! ✨
                <motion.button 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                  className="block mt-6 text-xl bg-blue-500 text-white px-10 py-3 rounded-3xl mx-auto pointer-events-auto shadow-xl clay-btn"
                >
                  WASH ANOTHER
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-2xl md:text-3xl font-black text-blue-800 text-center uppercase tracking-widest italic opacity-60">
        Splish Splash! Make it clean! 🧼
      </div>
    </div>
  );
};

export default CarWash;
