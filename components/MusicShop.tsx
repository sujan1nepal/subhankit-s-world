
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music as MusicIcon, Volume2 } from 'lucide-react';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const animals = [
  { id: 'lion', name: 'Lion', icon: '🦁', sound: 'Roar!', color: 'bg-orange-50', border: 'border-orange-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=69733_42571' },
  { id: 'duck', name: 'Duck', icon: '🦆', sound: 'Quack!', color: 'bg-yellow-50', border: 'border-yellow-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102221_50992' },
  { id: 'cow', name: 'Cow', icon: '🐮', sound: 'Moo!', color: 'bg-gray-50', border: 'border-gray-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102213_50992' },
  { id: 'frog', name: 'Frog', icon: '🐸', sound: 'Ribbit!', color: 'bg-green-50', border: 'border-green-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102214_50992' },
  { id: 'bird', name: 'Bird', icon: '🐦', sound: 'Chirp!', color: 'bg-blue-50', border: 'border-blue-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102211_50992' },
  { id: 'cat', name: 'Cat', icon: '🐱', sound: 'Meow!', color: 'bg-pink-50', border: 'border-pink-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102212_50992' },
  { id: 'pig', name: 'Pig', icon: '🐷', sound: 'Oink!', color: 'bg-rose-50', border: 'border-rose-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102220_50992' },
  { id: 'dog', name: 'Dog', icon: '🐶', sound: 'Woof!', color: 'bg-amber-50', border: 'border-amber-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102225_50992' },
  { id: 'sheep', name: 'Sheep', icon: '🐑', sound: 'Baaa!', color: 'bg-slate-50', border: 'border-slate-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102223_50992' },
  { id: 'horse', name: 'Horse', icon: '🐴', sound: 'Neigh!', color: 'bg-stone-50', border: 'border-stone-200', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102216_50992' },
  { id: 'monkey', name: 'Monkey', icon: '🐒', sound: 'Ooh Ooh Aah!', color: 'bg-yellow-100', border: 'border-yellow-300', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102218_50992' },
  { id: 'elephant', name: 'Elephant', icon: '🐘', sound: 'Trumpet!', color: 'bg-blue-100', border: 'border-blue-300', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102224_50992' },
  { id: 'rooster', name: 'Rooster', icon: '🐓', sound: 'Cock-a-doodle-doo!', color: 'bg-red-50', border: 'border-red-300', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102210_50992' },
  { id: 'owl', name: 'Owl', icon: '🦉', sound: 'Hoo Hoo!', color: 'bg-indigo-50', border: 'border-indigo-300', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102228_50992' },
  { id: 'bee', name: 'Bee', icon: '🐝', sound: 'Bzzzzz!', color: 'bg-yellow-50', border: 'border-yellow-400', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102227_50992' },
  { id: 'wolf', name: 'Wolf', icon: '🐺', sound: 'Awooo!', color: 'bg-gray-100', border: 'border-gray-300', audio: 'https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=102229_50992' },
];

const MusicShop: React.FC<Props> = ({ speak }) => {
  const [activeAnimal, setActiveAnimal] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAnimalClick = (animal: typeof animals[0]) => {
    setActiveAnimal(animal.id);
    
    if (audioRef.current) {
      audioRef.current.src = animal.audio;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Audio play failed, falling back to speech synthesis:", err);
        speak(animal.sound);
      });
    }

    // Introducing the animal with speech synthesis
    speak(`${animal.name}!`);

    setTimeout(() => setActiveAnimal(null), 2500);
  };

  return (
    <div className="w-full h-full bg-[#fce7f3] flex flex-col items-center overflow-hidden">
      <audio ref={audioRef} className="hidden" />
      
      <div className="w-full bg-white/90 backdrop-blur-md p-6 flex justify-between items-center shadow-xl z-20 shrink-0 border-b-4 border-pink-100">
        <h2 className="text-3xl md:text-5xl font-black text-pink-600 flex items-center gap-3 drop-shadow-sm">
          <MusicIcon size={44} className="animate-pulse" /> Animal Symphony
        </h2>
        <div className="bg-pink-100 px-8 py-2 rounded-full border-2 border-pink-200">
          <span className="text-pink-600 font-black uppercase tracking-widest hidden md:block">Real Animal Sounds!</span>
        </div>
      </div>
      
      <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6 md:p-10 w-full max-w-7xl overflow-y-auto content-start pb-32 scrollbar-hide">
        {animals.map((animal) => (
          <motion.button
            key={animal.id}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnimalClick(animal)}
            className={`${animal.color} p-4 md:p-6 rounded-[4rem] shadow-2xl border-4 ${animal.border} flex flex-col items-center justify-center gap-4 relative overflow-hidden h-60 md:h-80 clay-card group`}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <span className="text-7xl md:text-[10rem] drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 select-none">
                {animal.icon}
              </span>
              <span className="text-xl md:text-3xl font-black text-gray-700 uppercase tracking-widest mt-2 drop-shadow-sm">
                {animal.name}
              </span>
              
              <div className="absolute inset-0 bg-pink-400/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
            </div>
            
            <AnimatePresence>
              {activeAnimal === animal.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 45 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none bg-pink-500/10 backdrop-blur-[1px] z-10"
                >
                  <div className="bg-white text-pink-600 px-6 py-3 md:px-10 md:py-5 rounded-[2.5rem] font-black text-2xl md:text-4xl shadow-2xl border-4 border-pink-500 transform -rotate-3 scale-110 flex items-center gap-3">
                    <Volume2 size={40} /> {animal.sound}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      
      <div className="absolute bottom-8 w-full flex justify-center pointer-events-none z-10">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-white/90 backdrop-blur-md px-12 py-4 rounded-full border-4 border-pink-200 shadow-2xl text-pink-500 font-black text-xl tracking-[0.2em] uppercase italic"
        >
          🎵 Tap to hear real friends! 🎵
        </motion.div>
      </div>
    </div>
  );
};

export default MusicShop;
