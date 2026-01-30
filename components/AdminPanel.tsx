
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { CarWashImage } from '../types.ts';

interface Props {
  images: CarWashImage[];
  setImages: React.Dispatch<React.SetStateAction<CarWashImage[]>>;
  onBack: () => void;
}

const AdminPanel: React.FC<Props> = ({ images, setImages, onBack }) => {
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  const addImage = () => {
    if (!newUrl) return;
    const newImg: CarWashImage = {
      id: Date.now().toString(),
      name: newName || 'Unnamed Item',
      url: newUrl
    };
    setImages([...images, newImg]);
    setNewUrl('');
    setNewName('');
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUrl(reader.result as string);
        setNewName(file.name.split('.')[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <button onClick={onBack} className="p-4 bg-white rounded-3xl shadow-md clay-btn text-slate-600 hover:text-slate-900">
            <ArrowLeft size={32} />
          </button>
          <h2 className="text-4xl md:text-6xl font-black text-slate-800">Admin Panel</h2>
        </div>

        <section className="bg-white rounded-[3rem] p-8 shadow-xl clay-card mb-12 border-4 border-slate-100">
          <h3 className="text-2xl font-black text-slate-700 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Plus className="text-blue-500" /> Add New Wash Item
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              placeholder="Item Name (e.g. My Toy Car)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 outline-none focus:border-blue-400 font-bold"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Image URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-grow p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 outline-none focus:border-blue-400 font-bold"
              />
              <label className="p-5 bg-blue-100 text-blue-600 rounded-3xl cursor-pointer hover:bg-blue-200 transition-colors">
                <ImageIcon />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
          <button 
            onClick={addImage}
            className="w-full py-5 bg-blue-500 text-white rounded-3xl font-black text-xl shadow-lg clay-btn"
          >
            ADD TO COLLECTION
          </button>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map(img => (
            <motion.div 
              key={img.id} 
              layout
              className="bg-white p-4 rounded-[2.5rem] shadow-lg clay-card relative group border-2 border-slate-50"
            >
              <img src={img.url} alt={img.name} className="w-full aspect-square object-cover rounded-2xl mb-4 shadow-inner" />
              <p className="font-bold text-slate-700 text-center truncate px-2">{img.name}</p>
              <button 
                onClick={() => removeImage(img.id)}
                className="absolute -top-2 -right-2 p-3 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity clay-btn"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
