
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Settings, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { GameState, UserSettings, CarWashImage } from './types.ts';
import Neighborhood from './components/Neighborhood.tsx';
import MusicShop from './components/MusicShop.tsx';
import SortingGarden from './components/SortingGarden.tsx';
import ForestOfMystery from './components/ForestOfMystery.tsx';
import ArtStudio from './components/ArtStudio.tsx';
import CarWash from './components/CarWash.tsx';
import AlphabetZoo from './components/AlphabetZoo.tsx';
import RocketLauncher from './components/RocketLauncher.tsx';
import BalloonPop from './components/BalloonPop.tsx';
import NumberPark from './components/NumberPark.tsx';
import AdminPanel from './components/AdminPanel.tsx';

const DEFAULT_IMAGES: CarWashImage[] = [
  { id: '1', name: 'Sports Car', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80' },
  { id: '2', name: 'Dinosaur', url: 'https://images.unsplash.com/photo-1517930410339-01e350335e5a?w=800&q=80' },
  { id: '3', name: 'Puppy', url: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80' },
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HUB);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : { userName: 'Explorer', voiceEnabled: true };
  });
  
  const [customImages, setCustomImages] = useState<CarWashImage[]>(() => {
    const saved = localStorage.getItem('carWashImages');
    return saved ? JSON.parse(saved) : DEFAULT_IMAGES;
  });

  const [showSettings, setShowSettings] = useState(false);
  const femaleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        (v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Victoria')) && v.lang.startsWith('en')
      );
      femaleVoiceRef.current = preferred || voices.find(v => v.lang.startsWith('en')) || voices[0];
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (settings.voiceEnabled) {
      bgMusicRef.current?.play().catch(() => {});
    } else {
      bgMusicRef.current?.pause();
    }
  }, [settings.voiceEnabled]);

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('carWashImages', JSON.stringify(customImages));
  }, [customImages]);

  const speak = useCallback((text: string) => {
    if (!settings.voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (femaleVoiceRef.current) {
      utterance.voice = femaleVoiceRef.current;
    }
    // Playful lady voice settings
    utterance.rate = 1.1; 
    utterance.pitch = 1.3; 
    window.speechSynthesis.speak(utterance);
  }, [settings.voiceEnabled]);

  useEffect(() => {
    if (gameState === GameState.HUB) {
      speak(`Hey ${settings.userName}! Let's find something fun to do!`);
    }
  }, [gameState, settings.userName, speak]);

  const renderGame = () => {
    switch (gameState) {
      case GameState.MUSIC_SHOP: return <MusicShop onBack={() => setGameState(GameState.HUB)} speak={speak} />;
      case GameState.SORTING_GARDEN: return <SortingGarden onBack={() => setGameState(GameState.HUB)} speak={speak} />;
      case GameState.FOREST_OF_MYSTERY: return <ForestOfMystery onBack={() => setGameState(GameState.HUB)} speak={speak} />;
      case GameState.ART_STUDIO: return <ArtStudio onBack={() => setGameState(GameState.HUB)} speak={speak} />;
      case GameState.CAR_WASH: return <CarWash onBack={() => setGameState(GameState.HUB)} speak={speak} images={customImages} />;
      case GameState.ALPHABET_ZOO: return <AlphabetZoo onBack={() => setGameState(GameState.HUB)} speak={speak} />;
      case GameState.ROCKET_LAUNCHER: return <RocketLauncher onBack={() => setGameState(GameState.HUB)} speak={speak} />;
      case GameState.BALLOON_POP: return <BalloonPop onBack={() => setGameState(GameState.HUB)} speak={speak} />;
      case GameState.NUMBER_PARK: return <NumberPark onBack={() => setGameState(GameState.HUB)} speak={speak} />;
      case GameState.ADMIN: return <AdminPanel images={customImages} setImages={setCustomImages} onBack={() => setGameState(GameState.HUB)} />;
      default: return <Neighborhood onSelectGame={(game) => setGameState(game)} userName={settings.userName} />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#e0f2fe] perspective-container">
      {/* Background Music */}
      <audio 
        ref={bgMusicRef} 
        src="https://cdn.pixabay.com/download/audio/2022/02/10/audio_5101689255.mp3" 
        loop 
        autoPlay={settings.voiceEnabled}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0, rotateX: 10, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, rotateX: -10, y: -50, scale: 1.05 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="w-full h-full"
        >
          {renderGame()}
        </motion.div>
      </AnimatePresence>

      <div className="fixed top-6 right-6 flex gap-4 z-[100]">
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSettings(s => ({ ...s, voiceEnabled: !s.voiceEnabled }))}
          className="p-4 bg-white rounded-3xl shadow-lg clay-btn text-blue-500"
        >
          {settings.voiceEnabled ? <Volume2 size={32} /> : <VolumeX size={32} />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setGameState(GameState.ADMIN)}
          className="p-4 bg-white rounded-3xl shadow-lg clay-btn text-gray-500"
        >
          <ShieldAlert size={32} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(true)}
          className="p-4 bg-white rounded-3xl shadow-lg clay-btn text-purple-500"
        >
          <Settings size={32} />
        </motion.button>
        
        {gameState !== GameState.HUB && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setGameState(GameState.HUB)}
            className="p-4 bg-yellow-400 rounded-3xl shadow-lg clay-btn text-white"
          >
            <Home size={32} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
          >
            <motion.div
              initial={{ y: 100, scale: 0.8 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 100, scale: 0.8 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl clay-card"
            >
              <h2 className="text-4xl font-black mb-8 text-blue-600 text-center uppercase">Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-500 mb-2 font-black uppercase tracking-widest text-sm">Your Name</label>
                  <input
                    type="text"
                    value={settings.userName}
                    onChange={(e) => setSettings(s => ({ ...s, userName: e.target.value }))}
                    className="w-full p-5 bg-gray-50 border-4 border-gray-100 rounded-3xl focus:border-blue-400 outline-none text-2xl font-bold"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSettings(false)}
                className="mt-10 w-full bg-blue-500 text-white p-6 rounded-3xl text-2xl font-black shadow-xl clay-btn"
              >
                GO PLAY!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
