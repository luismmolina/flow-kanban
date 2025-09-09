import React, { useState, useEffect } from 'react';
import { type Card, type Column, CardSlaRisk, type Effort } from '../types';

interface CardSheetProps {
  card: Card;
  isCreating: boolean;
  onSave: (card: Card) => void;
  onClose: () => void;
  onArchive: (cardId: string) => void;
  columns: Column[];
}

const CardSheet: React.FC<CardSheetProps> = ({ card, isCreating, onSave, onClose, onArchive, columns }) => {
  const [editedCard, setEditedCard] = useState<Card>(card);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };
  
  const handleSave = () => {
    if (isCreating && !editedCard.title) {
        // Prevent creating empty cards
        handleClose();
        return;
    }
    onSave(editedCard);
    handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setEditedCard(prev => ({...prev, [name]: checked}));
    } else {
        setEditedCard(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleTag = (tag: string) => {
    setEditedCard(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };
  
  const getDueDateValue = () => {
    if (!editedCard.dueDate) return '';
    try {
      return new Date(editedCard.dueDate).toISOString().split('T')[0];
    } catch(e) {
      return '';
    }
  }

  const availableTags = ['UI', 'Backend', 'Bug', 'Feature', 'Docs', 'DevOps', 'QA'];
  const effortLevels: Effort[] = ['S', 'M', 'L'];

  return (
    <div className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div 
        onClick={e => e.stopPropagation()}
        className={`fixed bottom-0 left-0 right-0 bg-neutral-850 rounded-t-2xl flex flex-col transform transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-center">{isCreating ? 'New Card' : 'Edit Card'}</h2>
        </div>
        
        <div className="space-y-4 overflow-y-auto px-4 max-h-[calc(80vh-8rem)]">
          <input
            type="text"
            name="title"
            value={editedCard.title}
            onChange={handleChange}
            placeholder="Card Title"
            className="w-full p-3 bg-neutral-700 rounded-lg text-white placeholder-neutral-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div>
            <label className="text-xs text-neutral-400">Column</label>
            <select name="columnId" value={editedCard.columnId} onChange={handleChange} className="w-full p-3 bg-neutral-700 rounded-lg mt-1 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              {columns.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-neutral-400 mb-2 block">Effort</label>
            <div className="flex gap-2">
              {effortLevels.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEditedCard(prev => ({...prev, effort: prev.effort === e ? undefined : e }))}
                  className={`px-4 py-2 text-sm rounded-full font-semibold transition-colors w-full ${editedCard.effort === e ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300'}`}
                >{e}</button>
              ))}
            </div>
          </div>

           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400">Due Date</label>
              <input type="date" name="dueDate" value={getDueDateValue()} onChange={handleChange} className="w-full p-2.5 bg-neutral-700 rounded-lg mt-1 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2.5 bg-neutral-700 rounded-lg w-full">
                <input type="checkbox" name="blocked" checked={editedCard.blocked} onChange={handleChange} className="h-5 w-5 rounded bg-neutral-600 text-red-500 focus:ring-red-500 border-neutral-500" />
                <span className="font-semibold text-red-400">Blocked</span>
              </label>
            </div>
          </div>

          <div>
             <label className="text-xs text-neutral-400 mb-2 block">Tags</label>
             <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${editedCard.tags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300'}`}
                  >{tag}</button>
                ))}
             </div>
          </div>
        </div>
        <div 
          className="p-4 bg-neutral-850/90 backdrop-blur-sm mt-auto border-t border-neutral-700 flex items-center gap-3"
          style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}
        >
          {!isCreating && (
            <button onClick={() => onArchive(editedCard.id)} className="px-4 py-3 bg-neutral-700 text-red-400 font-semibold rounded-full text-base hover:bg-neutral-600">Archive</button>
          )}
          <button onClick={handleSave} className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-full text-base hover:bg-blue-500">{isCreating ? 'Create Card' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
};

export default CardSheet;
