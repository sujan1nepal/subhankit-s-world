
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music as MusicIcon, Play } from 'lucide-react';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const animals = [
  { id: 'lion', name: 'Lion', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=400&fit=crop', sound: 'Roar!', color: 'bg-orange-100', audio: 'https://cdn.freesound.org/previews/146/146209_1637731-lq.mp3' },
  { id: 'duck', name: 'Duck', img: 'https://images.unsplash.com/photo-1555854817-2b214be2eff2?w=400&h=400&fit=crop', sound: 'Quack!', color: 'bg-yellow-100', audio: 'https://cdn.freesound.org/previews/163/163359_3012117-lq.mp3' },
  { id: 'cow', name: 'Cow', img: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=400&h=400&fit=crop', sound: 'Moo!', color: 'bg-gray-50', audio: 'https://cdn.freesound.org/previews/58/58277_634166-lq.mp3' },
  { id: 'frog', name: 'Frog', img: 'https://images.unsplash.com/photo-1544067331-e5b206a708e0?w=400&h=400&fit=crop', sound: 'Ribbit!', color: 'bg-green-100', audio: 'https://cdn.freesound.org/previews/173/173546_2731495-lq.mp3' },
  { id: 'bird', name: 'Bird', img: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=400&h=400&fit=crop', sound: 'Chirp!', color: 'bg-blue-100', audio: 'https://cdn.freesound.org/previews/174/174463_2361665-lq.mp3' },
  { id: 'cat', name: 'Cat', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop', sound: 'Meow!', color: 'bg-pink-100', audio: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3' },
  { id: 'pig', name: 'Pig', img: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=400&fit=crop', sound: 'Oink!', color: 'bg-rose-100', audio: 'https://cdn.freesound.org/previews/442/442907_1268571-lq.mp3' },
  { id: 'dog', name: 'Dog', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', sound: 'Woof!', color: 'bg-amber-50', audio: 'https://cdn.freesound.org/previews/170/170522_2731495-lq.mp3' },
];

const MusicShop: React.FC<Props> = ({ speak }) => {
  const [activeAnimal, setActiveAnimal] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAnimalClick = (animal: typeof animals[0]) => {
    setActiveAnimal(animal.id);
    speak(`${animal.name} says...`);
    
    if (audioRef.current) {
      audioRef.current.src = animal.audio;
      audioRef.current.play().catch(() => {
        // Fallback to speech if audio fails
        speak(animal.sound);
      });
    }

    setTimeout(() => setActiveAnimal(null), 1500);
  };

  return (
    <div className="w-full h-full bg-[#fce7f3] flex flex-col items-center overflow-hidden perspective-container">
      <audio ref={audioRef} className="hidden" />
      <div className="w-full bg-white/90 backdrop-blur-md p-6 flex justify-between items-center shadow-xl z-20 shrink-0">
        <h2 className="text-3xl md:text-5xl font-black text-pink-600 flex items-center gap-3 drop-shadow-md">
          <MusicIcon size={40} /> Animal Symphony
        </h2>
        <div className="bg-pink-100 px-6 py-2 rounded-full border-2 border-pink-200">
          <span className="text-pink-600 font-bold uppercase tracking-widest hidden md:block">Tap an animal to hear its song!</span>
        </div>
      </div>
      
      <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 md:p-10 w-full max-w-7xl overflow-y-auto content-start pb-24">
        {animals.map((animal) => (
          <motion.button
            key={animal.id}
            whileHover={{ scale: 1.05, y: -8, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnimalClick(animal)}
            className={`${animal.color} p-4 rounded-[3rem] shadow-2xl border-4 border-white flex flex-col items-center gap-4 relative overflow-hidden h-60 md:h-80 clay-card group`}
          >
            <div className="w-full h-2/3 rounded-[2rem] overflow-hidden shadow-inner border-2 border-white/50 relative">
              <img src={animal.img} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl md:text-3xl font-black text-gray-700 uppercase tracking-widest drop-shadow-sm">{animal.name}</span>
            
            <AnimatePresence>
              {activeAnimal === animal.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 45 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none bg-pink-500/20 backdrop-blur-[2px]"
                >
                  <div className="bg-white text-pink-600 px-10 py-5 rounded-[2rem] font-black text-3xl shadow-2xl border-4 border-pink-500 transform -rotate-3 scale-110">
                    {animal.sound}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      
      <div className="absolute bottom-6 w-full flex justify-center pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md px-10 py-3 rounded-full border-2 border-pink-100 shadow-lg text-pink-400 font-black tracking-[0.3em] uppercase">
          ♫ Play the Music ♫
        </div>
      </div>
    </div>
  );
};

export default MusicShop;
