
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onKey: (key: string) => void;
  type?: 'letters' | 'numbers';
}

const VirtualKeyboard: React.FC<Props> = ({ onKey, type = 'letters' }) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbers = '0123456789'.split('');
  const keys = type === 'letters' ? letters : numbers;

  return (
    <div className="w-full max-w-6xl p-6 bg-white/40 backdrop-blur-xl rounded-[3rem] flex flex-wrap justify-center gap-3 md:gap-4 mt-auto shadow-2xl border-4 border-white/50 perspective-container">
      {keys.map((k) => (
        <motion.button
          key={k}
          whileHover={{ 
            scale: 1.2, 
            y: -5,
            rotateX: -10,
            boxShadow: "0px 15px 30px rgba(0,0,0,0.15)"
          }}
          whileTap={{ scale: 0.9, y: 5 }}
          onClick={() => onKey(k)}
          className="w-12 h-16 md:w-20 md:h-24 bg-white rounded-3xl shadow-lg border-b-8 border-slate-200 flex items-center justify-center text-2xl md:text-5xl font-black text-slate-700 clay-btn transition-all"
        >
          {k}
        </motion.button>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
