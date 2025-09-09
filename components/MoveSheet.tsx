import React, { useState, useEffect } from 'react';
import { type Column } from '../types';

interface MoveSheetProps {
  cardId: string;
  columns: Column[];
  onMove: (cardId: string, columnId: string) => void;
  onClose: () => void;
}

const MoveSheet: React.FC<MoveSheetProps> = ({ cardId, columns, onMove, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const handleMove = (columnId: string) => {
    onMove(cardId, columnId);
    handleClose();
  };

  return (
    <div className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div 
        onClick={e => e.stopPropagation()}
        className={`fixed bottom-0 left-0 right-0 bg-neutral-850 rounded-t-2xl p-4 transform transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Move Card to...</h2>
        </div>
        
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pb-4">
          {columns.map(col => (
            <button
              key={col.id}
              onClick={() => handleMove(col.id)}
              className="w-full p-4 bg-neutral-700 rounded-lg text-left text-white font-semibold hover:bg-neutral-600 transition-colors"
            >
              {col.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoveSheet;
