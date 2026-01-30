
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Image as ImageIcon } from 'lucide-react';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const backgrounds = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', // Forest
  'https://images.unsplash.com/photo-1444084316824-dc26d6657664?w=800&q=80', // Space
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // Beach
  'https://images.unsplash.com/photo-1500628539100-21827d4af842?w=800&q=80', // Farm
];

const stickers = [
  { icon: '⭐', label: 'Star' },
  { icon: '🌙', label: 'Moon' },
  { icon: '🚀', label: 'Rocket' },
  { icon: '🎨', label: 'Paint' },
  { icon: '🐱', label: 'Cat' },
  { icon: '🌈', label: 'Rainbow' },
  { icon: '🍦', label: 'Ice Cream' },
  { icon: '🎈', label: 'Balloon' },
  { icon: '🦖', label: 'Dinosaur' },
  { icon: '🚗', label: 'Car' }
];

const ArtStudio: React.FC<Props> = ({ speak }) => {
  const [canvasStickers, setCanvasStickers] = useState<{ id: number; icon: string; x: number; y: number; scale: number; rotate: number }[]>([]);
  const [selectedSticker, setSelectedSticker] = useState(stickers[0]);
  const [bgIndex, setBgIndex] = useState(0);

  const handleCanvasClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCanvasStickers([...canvasStickers, { 
      id: Date.now(), 
      icon: selectedSticker.icon, 
      x, 
      y,
      scale: 0.8 + Math.random() * 0.5,
      rotate: Math.random() * 40 - 20
    }]);
    speak(`Stamp! A beautiful ${selectedSticker.label}!`);
  };

  return (
    <div className="w-full h-full bg-[#fff7ed] flex flex-col p-4 md:p-8 overflow-hidden">
      {/* Tools Panel */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-[3rem] shadow-xl clay-card mb-6 flex flex-col md:flex-row gap-6 items-center border-4 border-orange-100">
        <div className="flex gap-3 overflow-x-auto pb-2 flex-grow scrollbar-hide w-full md:w-auto">
          {stickers.map(s => (
            <motion.button
              key={s.label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedSticker(s);
                speak(s.label);
              }}
              className={`text-5xl p-5 min-w-[100px] h-24 rounded-3xl transition-all clay-btn ${selectedSticker.label === s.label ? 'bg-orange-500 shadow-orange-200' : 'bg-orange-50 hover:bg-orange-100'}`}
            >
              {s.icon}
            </motion.button>
          ))}
        </div>
        
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setBgIndex((prev) => (prev + 1) % backgrounds.length);
              speak("New place to draw!");
            }}
            className="p-5 bg-blue-100 text-blue-600 rounded-[2rem] clay-btn flex items-center gap-2 font-black"
          >
            <ImageIcon size={32} /> BG
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setCanvasStickers([]);
              speak("All clean!");
            }}
            className="p-5 bg-red-100 text-red-600 rounded-[2rem] clay-btn"
          >
            <Trash2 size={32} />
          </motion.button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-grow relative overflow-hidden group">
        <motion.div 
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 w-full h-full rounded-[4rem] border-8 border-white shadow-2xl cursor-crosshair overflow-hidden"
          onClick={handleCanvasClick}
        >
          <img src={backgrounds[bgIndex]} className="w-full h-full object-cover select-none pointer-events-none" />
          
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />
          
          <AnimatePresence>
            {canvasStickers.map(sticker => (
              <motion.div
                key={sticker.id}
                initial={{ scale: 0, rotate: -45, y: -20 }}
                animate={{ scale: sticker.scale, rotate: sticker.rotate, y: 0 }}
                className="absolute text-7xl md:text-9xl pointer-events-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
                style={{ left: sticker.x - 50, top: sticker.y - 50 }}
              >
                {sticker.icon}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {canvasStickers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-4xl md:text-6xl font-black text-white/50 uppercase tracking-widest drop-shadow-md italic">
                Tap to add stickers!
              </span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-orange-800 text-xl font-black uppercase tracking-widest opacity-60 italic">
          Create your own magic picture! 🎨
        </p>
      </div>
    </div>
  );
};

export default ArtStudio;
