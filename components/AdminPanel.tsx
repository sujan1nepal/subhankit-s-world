
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, Smile } from 'lucide-react';
import { WashItem } from '../types.ts';

interface Props {
  items: WashItem[];
  setItems: React.Dispatch<React.SetStateAction<WashItem[]>>;
  onBack: () => void;
}

const COLORS = [
  'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 
  'bg-purple-400', 'bg-pink-400', 'bg-orange-400', 'bg-indigo-400'
];

const AdminPanel: React.FC<Props> = ({ items, setItems, onBack }) => {
  const [newIcon, setNewIcon] = useState('');
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const addItem = () => {
    if (!newIcon || !newName) return;
    const newItem: WashItem = {
      id: Date.now().toString(),
      name: newName,
      icon: newIcon,
      color: selectedColor
    };
    setItems([...items, newItem]);
    setNewIcon('');
    setNewName('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto p-6 md:p-12">
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center gap-6 mb-12">
          <button onClick={onBack} className="p-4 bg-white rounded-3xl shadow-md clay-btn text-slate-600 hover:text-slate-900">
            <ArrowLeft size={32} />
          </button>
          <h2 className="text-4xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter">Admin Panel</h2>
        </div>

        <section className="bg-white rounded-[3rem] p-8 shadow-xl clay-card mb-12 border-4 border-slate-100">
          <h3 className="text-2xl font-black text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Plus className="text-blue-500" /> Add New Wash Item
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              placeholder="Name (e.g. Blue Car)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 outline-none focus:border-blue-400 font-bold text-xl"
            />
            <input
              type="text"
              placeholder="Icon Emoji (e.g. 🚘)"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 outline-none focus:border-blue-400 font-bold text-3xl text-center"
            />
          </div>
          
          <div className="mb-8">
            <p className="font-black text-slate-400 mb-4 uppercase text-sm">Background Color</p>
            <div className="flex flex-wrap gap-4">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-12 h-12 rounded-2xl ${c} border-4 transition-all ${selectedColor === c ? 'border-slate-800 scale-110 shadow-lg' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>

          <button 
            onClick={addItem}
            disabled={!newIcon || !newName}
            className="w-full py-6 bg-blue-500 text-white rounded-3xl font-black text-2xl shadow-lg clay-btn disabled:opacity-50"
          >
            ADD TO COLLECTION
          </button>
        </section>

        <h4 className="text-xl font-black text-slate-400 mb-6 uppercase tracking-widest">Current Items ({items.length})</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map(item => (
            <motion.div 
              key={item.id} 
              layout
              className="bg-white p-4 rounded-[2.5rem] shadow-lg clay-card relative group border-2 border-slate-50"
            >
              <div className={`w-full aspect-square rounded-2xl mb-4 flex items-center justify-center text-6xl shadow-inner ${item.color}`}>
                {item.icon}
              </div>
              <p className="font-bold text-slate-700 text-center truncate px-2 uppercase">{item.name}</p>
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute -top-2 -right-2 p-3 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity clay-btn"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
