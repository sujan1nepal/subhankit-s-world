
import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types.ts';
import { 
  Music, 
  Sprout, 
  Trees, 
  Palette, 
  Car, 
  Bird, 
  Rocket, 
  Gamepad2,
  Binary,
  Mic2,
  Trophy
} from 'lucide-react';

interface Props {
  onSelectGame: (game: GameState) => void;
  userName: string;
}

const Neighborhood: React.FC<Props> = ({ onSelectGame, userName }) => {
  const apps = [
    { id: GameState.MUSIC_SHOP, icon: <Music size={48} />, color: 'bg-pink-400', label: 'Music', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80' },
    { id: GameState.SORTING_GARDEN, icon: <Sprout size={48} />, color: 'bg-green-400', label: 'Garden', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80' },
    { id: GameState.FOREST_OF_MYSTERY, icon: <Trees size={48} />, color: 'bg-emerald-500', label: 'Forest', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80' },
    { id: GameState.ART_STUDIO, icon: <Palette size={48} />, color: 'bg-orange-400', label: 'Art', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80' },
    { id: GameState.CAR_WASH, icon: <Car size={48} />, color: 'bg-blue-400', label: 'Wash', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80' },
    { id: GameState.ALPHABET_ZOO, icon: <Bird size={48} />, color: 'bg-yellow-500', label: 'Zoo', img: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&q=80' },
    { id: GameState.RACING_GAME, icon: <Trophy size={48} />, color: 'bg-cyan-500', label: 'Racer', img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=80' },
    { id: GameState.ROCKET_LAUNCHER, icon: <Rocket size={48} />, color: 'bg-indigo-500', label: 'Space', img: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80' },
    { id: GameState.BALLOON_POP, icon: <Gamepad2 size={48} />, color: 'bg-red-400', label: 'Arcade', img: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=400&q=80' },
    { id: GameState.NUMBER_PARK, icon: <Binary size={48} />, color: 'bg-purple-500', label: 'Numbers', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80' },
    { id: GameState.WORD_LAB, icon: <Mic2 size={48} />, color: 'bg-rose-500', label: 'Speech', img: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&q=80' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    show: { scale: 1, opacity: 1, y: 0 }
  };

  return (
    <div className="relative w-full h-full bg-[#e0f2fe] flex flex-col items-center overflow-hidden perspective-container">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-300 to-indigo-400 -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [-100, 100, -100]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            x: [100, -100, 100]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full"
        />
      </div>

      <div className="w-full pt-12 pb-6 px-10 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block px-8 py-3 bg-white/30 backdrop-blur-md rounded-full shadow-lg border border-white/20"
        >
          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] uppercase tracking-tighter">
            {userName}'s Fun Pad
          </h1>
        </motion.div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-grow w-full max-w-6xl p-6 md:p-12 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-10 content-start"
      >
        {apps.map((app) => (
          <motion.button
            key={app.id}
            variants={item}
            whileHover={{ 
              scale: 1.1, 
              rotateZ: -2,
              z: 50,
              boxShadow: "0px 25px 50px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelectGame(app.id)}
            className="group relative flex flex-col items-center gap-3"
          >
            <div className={`w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] ${app.color} p-1 shadow-2xl clay-btn overflow-hidden border-4 border-white relative`}>
              <img 
                src={app.img} 
                alt={app.label} 
                className="w-full h-full object-cover rounded-[2rem] opacity-60 mix-blend-overlay group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md group-hover:animate-bounce">
                {app.icon}
              </div>
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/30 to-transparent rotate-45 pointer-events-none" />
            </div>
            
            <span className="text-xl md:text-2xl font-black text-white drop-shadow-md uppercase tracking-widest bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
              {app.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      <div className="w-full h-24 bg-white/20 backdrop-blur-xl border-t border-white/30 flex justify-center items-center gap-12 px-10">
        <motion.div whileHover={{ scale: 1.2 }} className="text-4xl">🎮</motion.div>
        <motion.div whileHover={{ scale: 1.2 }} className="text-4xl">🏠</motion.div>
        <motion.div whileHover={{ scale: 1.2 }} className="text-4xl">🌟</motion.div>
      </div>
    </div>
  );
};

export default Neighborhood;
