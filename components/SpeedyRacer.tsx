
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ArrowRight, ArrowLeft, ArrowRight as ArrowRightIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  speak: (t: string) => void;
}

interface Pickup {
  id: number;
  char: string;
  lane: number; // 0: Left, 1: Center, 2: Right
  z: number;    // 1000 down to 0
}

const SpeedyRacer: React.FC<Props> = ({ speak }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [targetChar, setTargetChar] = useState('');
  const [carLane, setCarLane] = useState(1);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  const pickupsRef = useRef<Pickup[]>([]);
  const frameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const carLaneRef = useRef<number>(1);
  
  // VERY SLOW CONSTANT SPEED - perfect for a 4-year-old
  const CONSTANT_SPEED = 0.45;
  const GOAL_PER_LEVEL = 5;

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const generateTarget = useCallback(() => {
    const next = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    setTargetChar(next);
    speak(`Find the ${next}!`);
  }, [speak]);

  useEffect(() => {
    generateTarget();
  }, [generateTarget]);

  useEffect(() => {
    carLaneRef.current = carLane;
  }, [carLane]);

  const handleInput = useCallback((key: string) => {
    if (isLevelComplete) return;
    if (key === 'ArrowLeft') {
      setCarLane(prev => Math.max(0, prev - 1));
    } else if (key === 'ArrowRight') {
      setCarLane(prev => Math.min(2, prev + 1));
    }
  }, [isLevelComplete]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => handleInput(e.key);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleInput]);

  const startNextLevel = () => {
    setIsLevelComplete(false);
    setLevelProgress(0);
    setLevel(l => l + 1);
    pickupsRef.current = [];
    generateTarget();
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    if (isLevelComplete) return;

    // Background (Sky)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#0f172a');
    skyGradient.addColorStop(0.5, '#1e293b');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    const horizonY = height * 0.45;
    const roadBottomW = width * 0.95;
    const roadTopW = width * 0.05;

    // Road Body
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(width / 2 - roadTopW / 2, horizonY);
    ctx.lineTo(width / 2 + roadTopW / 2, horizonY);
    ctx.lineTo(width / 2 + roadBottomW / 2, height);
    ctx.lineTo(width / 2 - roadBottomW / 2, height);
    ctx.closePath();
    ctx.fill();

    // Road Borders (Glowing Blue)
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2 - roadTopW / 2, horizonY);
    ctx.lineTo(width / 2 - roadBottomW / 2, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width / 2 + roadTopW / 2, horizonY);
    ctx.lineTo(width / 2 + roadBottomW / 2, height);
    ctx.stroke();

    // Lane Dividers (Dashed & Slow)
    ctx.strokeStyle = '#475569';
    ctx.setLineDash([20, 40]);
    ctx.lineDashOffset = -frameRef.current * (CONSTANT_SPEED * 3);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - roadTopW / 6, horizonY);
    ctx.lineTo(width / 2 - roadBottomW / 6, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width / 2 + roadTopW / 6, horizonY);
    ctx.lineTo(width / 2 + roadBottomW / 6, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Process Pickups
    const pickups = pickupsRef.current;
    for (let i = pickups.length - 1; i >= 0; i--) {
      const p = pickups[i];
      p.z -= CONSTANT_SPEED * 4; // Constant approach speed

      const scale = Math.pow(1 - (p.z / 1000), 2.5);
      if (scale < 0) continue;

      const currentRoadW = roadTopW + (roadBottomW - roadTopW) * scale;
      const xOffset = (p.lane - 1) * (currentRoadW / 3);
      const x = width / 2 + xOffset;
      const y = horizonY + (height - horizonY) * scale;
      const size = 10 + 90 * scale;

      if (y > horizonY) {
        ctx.save();
        if (p.char === targetChar) {
          ctx.shadowBlur = 30;
          ctx.shadowColor = '#fbbf24';
          ctx.fillStyle = '#fbbf24';
        } else {
          ctx.fillStyle = '#ffffff';
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#000000';
        ctx.font = `bold ${Math.round(size * 1.2)}px Fredoka`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, x, y);
      }

      // Collision Detection
      if (p.z <= 100 && p.z >= -20) {
        if (p.lane === carLaneRef.current) {
          if (p.char === targetChar) {
            setScore(s => s + 10);
            const nextProgress = levelProgress + 1;
            setLevelProgress(nextProgress);
            speak('Yay!');
            confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
            
            if (nextProgress >= GOAL_PER_LEVEL) {
              setIsLevelComplete(true);
              speak(`Winner! You got ${score + 10} points! Great racing!`);
              confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
            } else {
              generateTarget();
            }
          } else {
            speak(`Find the ${targetChar}`);
            // Screen shake / flash logic could go here, keeping it simple for 4yo
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.fillRect(0, 0, width, height);
          }
          pickups.splice(i, 1);
        }
      }

      if (p.z < -200) pickups.splice(i, 1);
    }

    // Spawn Pickups (Constant and slow spawn)
    if (Date.now() - lastSpawnRef.current > 4000) {
      const char = Math.random() > 0.6 ? targetChar : ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      pickups.push({
        id: Date.now(),
        char,
        lane: Math.floor(Math.random() * 3),
        z: 1000
      });
      lastSpawnRef.current = Date.now();
    }

    // Draw Car - STRAIGHTENED to face forward
    const carX = width / 2 + (carLaneRef.current - 1) * (roadBottomW / 3);
    const carY = height - 120;
    const carSize = 130;

    ctx.save();
    ctx.translate(carX, carY);
    // Standard race car emoji 🏎️ faces right. 
    // We rotate it -90 degrees (-Math.PI/2) to point forward/up.
    ctx.rotate(-Math.PI / 2);
    ctx.font = `${carSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏎️', 0, 0);
    ctx.restore();

    frameRef.current++;
  }, [targetChar, generateTarget, speak, ALPHABET, isLevelComplete, levelProgress, score]);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    draw(ctx, canvas.width, canvas.height);
    requestAnimationFrame(loop);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    const animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [loop]);

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col relative overflow-hidden">
      {/* HUD */}
      <div className="absolute top-8 left-0 w-full flex justify-between px-10 z-20 pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/20 flex items-center gap-3 shadow-xl">
            <Trophy className="text-yellow-400" size={32} />
            <span className="text-3xl font-black text-white">{score}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-black text-sm uppercase">
            LEVEL {level} • {levelProgress}/{GOAL_PER_LEVEL} CAUGHT
          </div>
        </div>

        <motion.div 
          key={targetChar}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-yellow-400 px-10 py-4 rounded-[2.5rem] shadow-2xl border-4 border-white flex flex-col items-center"
        >
          <span className="text-slate-600 font-black uppercase text-xs">GO GET</span>
          <span className="text-7xl font-black text-slate-800">{targetChar}</span>
        </motion.div>
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Progress Bar for the Level */}
      <div className="absolute top-0 left-0 w-full h-2 bg-white/10 z-30">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(levelProgress / GOAL_PER_LEVEL) * 100}%` }}
          className="h-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
        />
      </div>

      {/* Touch Steering Buttons */}
      <div className="absolute bottom-12 left-0 w-full flex justify-between px-12 z-20 pointer-events-none">
         <motion.button
            whileTap={{ scale: 0.8 }}
            className="pointer-events-auto w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl"
            onPointerDown={() => handleInput('ArrowLeft')}
         >
           <ArrowLeft size={48} className="text-white" />
         </motion.button>
         <motion.button
            whileTap={{ scale: 0.8 }}
            className="pointer-events-auto w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl"
            onPointerDown={() => handleInput('ArrowRight')}
         >
           <ArrowRightIcon size={48} className="text-white" />
         </motion.button>
      </div>

      {/* Winner Overlay */}
      <AnimatePresence>
        {isLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-lg flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-12 rounded-[4rem] text-center shadow-2xl clay-card border-8 border-yellow-400 max-w-lg"
            >
              <Star className="text-yellow-400 mx-auto mb-6 fill-yellow-400" size={100} />
              <h3 className="text-6xl font-black text-indigo-600 mb-2 uppercase tracking-tighter">WINNER!</h3>
              <p className="text-2xl font-bold text-slate-500 mb-8 uppercase tracking-widest">LEVEL {level} DONE!</p>
              <div className="text-5xl font-black text-yellow-500 mb-10">SCORE: {score}</div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startNextLevel}
                className="px-12 py-6 bg-indigo-500 text-white rounded-full font-black text-3xl shadow-xl clay-btn flex items-center gap-4 mx-auto"
              >
                NEXT LEVEL <ArrowRightIcon size={40} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 w-full text-center z-10">
        <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px]">
          Very Slow Safe Mode • Constant Speed
        </p>
      </div>
    </div>
  );
};

export default SpeedyRacer;
