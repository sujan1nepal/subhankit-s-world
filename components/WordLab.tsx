
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Star, Volume2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

const items = [
  { name: 'Apple', icon: '🍎', color: 'bg-red-50', border: 'border-red-200' },
  { name: 'Banana', icon: '🍌', color: 'bg-yellow-50', border: 'border-yellow-200' },
  { name: 'Cat', icon: '🐱', color: 'bg-orange-50', border: 'border-orange-200' },
  { name: 'Dog', icon: '🐶', color: 'bg-amber-50', border: 'border-amber-200' },
  { name: 'Elephant', icon: '🐘', color: 'bg-blue-50', border: 'border-blue-200' },
  { name: 'Sun', icon: '☀️', color: 'bg-yellow-50', border: 'border-yellow-400' },
  { name: 'Moon', icon: '🌙', color: 'bg-indigo-50', border: 'border-indigo-200' },
  { name: 'Tiger', icon: '🐯', color: 'bg-orange-50', border: 'border-orange-300' },
  { name: 'Panda', icon: '🐼', color: 'bg-slate-50', border: 'border-slate-300' },
  { name: 'Grapes', icon: '🍇', color: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'Star', icon: '⭐', color: 'bg-yellow-50', border: 'border-yellow-300' },
  { name: 'Heart', icon: '❤️', color: 'bg-pink-50', border: 'border-pink-200' },
];

const WordLab: React.FC<Props> = ({ speak }) => {
  const [selectedItem, setSelectedItem] = useState<typeof items[0] | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [recognizedText, setRecognizedText] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setRecognizedText(transcript);
        if (selectedItem && transcript.includes(selectedItem.name.toLowerCase())) {
          handleSuccess();
        } else {
          handleFail();
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setStatus('fail');
        speak(`Oops! I didn't hear you. Try again!`);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [speak, selectedItem]);

  const handleItemSelect = (item: typeof items[0]) => {
    setSelectedItem(item);
    setStatus('idle');
    setRecognizedText('');
    speak(`This is a ${item.name}. Can you say... ${item.name}?`);
  };

  const toggleListening = () => {
    if (!selectedItem) return;
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setRecognizedText('');
      setStatus('idle');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSuccess = () => {
    setStatus('success');
    speak(`Great job! You said ${selectedItem?.name}!`);
    confetti({ 
      particleCount: 100, 
      spread: 70, 
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbbf24', '#ffffff'] 
    });
    setTimeout(() => {
      setStatus('idle');
      setRecognizedText('');
    }, 2500);
  };

  const handleFail = () => {
    setStatus('fail');
    speak(`Try again! ${selectedItem?.name}!`);
    setTimeout(() => setStatus('idle'), 1500);
  };

  return (
    <div className="w-full h-full bg-[#fff1f2] flex flex-col items-center p-4 overflow-hidden">
      <div className="text-center shrink-0 mb-4 mt-2 flex items-center justify-center gap-4">
        {selectedItem && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setSelectedItem(null); speak("Pick another one!"); }}
            className="p-3 bg-white text-rose-500 rounded-2xl shadow-md clay-btn"
          >
            <ArrowLeft size={28} />
          </motion.button>
        )}
        <h2 className="text-4xl md:text-5xl font-black text-rose-500 uppercase tracking-tighter">
          {selectedItem ? "Repeat After Me" : "Pick Something!"}
        </h2>
      </div>

      <div className="flex-grow w-full max-w-6xl overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {!selectedItem ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4 h-full overflow-y-auto content-start pb-20"
            >
              {items.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleItemSelect(item)}
                  className={`flex flex-col items-center justify-center bg-white p-4 rounded-[2.5rem] shadow-xl border-4 ${item.border} clay-btn aspect-square`}
                >
                  <span className="text-6xl md:text-8xl drop-shadow-md mb-2">{item.icon}</span>
                  <span className="text-lg md:text-xl font-black text-rose-600 uppercase tracking-tighter">{item.name}</span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="w-full h-full flex flex-col items-center justify-center p-2"
            >
              <div className="bg-white p-6 md:p-8 rounded-[4rem] shadow-2xl border-[16px] border-rose-100 w-full max-w-4xl h-full flex flex-col items-center clay-card overflow-hidden">
                <div className={`flex-grow w-full rounded-[3rem] flex items-center justify-center mb-6 shadow-inner border-4 border-rose-50 relative ${selectedItem.color}`}>
                  <span className="text-[12rem] md:text-[20rem] drop-shadow-2xl filter saturate-150">
                    {selectedItem.icon}
                  </span>
                  {status === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-rose-400/10 backdrop-blur-[2px] flex items-center justify-center">
                      <Star size={150} className="text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-6 shrink-0 mb-4">
                  <h3 className="text-6xl md:text-8xl font-black text-rose-600 uppercase tracking-tighter">{selectedItem.name}</h3>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => speak(selectedItem.name)} className="p-5 bg-rose-100 text-rose-500 rounded-full shadow-md clay-btn">
                    <Volume2 size={32} />
                  </motion.button>
                </div>

                {recognizedText && <p className="text-xl font-bold text-slate-400 italic">I heard: "{recognizedText}"</p>}

                <div className="mt-4 flex items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleListening}
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-xl clay-btn ${isListening ? 'bg-red-500 text-white' : 'bg-white text-rose-500'}`}
                  >
                    {isListening && <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity }} className="absolute inset-0 bg-red-400 rounded-full opacity-30" />}
                    <Mic size={48} />
                  </motion.button>
                  <div className="bg-rose-500 px-8 py-3 rounded-full shadow-lg">
                    <span className="text-white text-xl font-black uppercase tracking-widest">{isListening ? "Listening..." : "Tap & Speak!"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!selectedItem && (
        <div className="mt-4 mb-4 shrink-0">
          <div className="bg-rose-500 px-10 py-3 rounded-full shadow-lg border-b-4 border-rose-700">
            <span className="text-white text-xl md:text-2xl font-black uppercase tracking-widest italic">Pick a friend to learn!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordLab;
