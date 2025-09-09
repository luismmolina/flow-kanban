
import React from 'react';
import { type Card, type Column } from '../types';

interface StatsOverlayProps {
  isVisible: boolean;
  cards: Card[];
  columns: Column[];
  cardsByColumn: { [key: string]: Card[] };
}

const StatsOverlay: React.FC<StatsOverlayProps> = ({ isVisible, cards, columns, cardsByColumn }) => {
  if (!isVisible) return null;

  const totalCards = cards.length;
  const blockedCards = cards.filter(c => c.blocked).length;
  
  // Simplified cycle time calculation (average age of cards in "Done")
  const doneColumnId = columns.find(c => c.title.toLowerCase() === 'done')?.id;
  const doneCards = doneColumnId ? cardsByColumn[doneColumnId] || [] : [];
  const avgCycleTimeDays = doneCards.length > 0 
    ? (doneCards.reduce((acc, card) => acc + (Date.now() - card.age), 0) / doneCards.length) / (1000 * 60 * 60 * 24)
    : 0;

  return (
    <div className="bg-neutral-850 border-b border-neutral-700 p-3 text-sm text-neutral-300">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-bold text-white">{totalCards}</p>
          <p className="text-xs text-neutral-400">Total WIP</p>
        </div>
        <div>
          <p className="font-bold text-red-400">{blockedCards}</p>
          <p className="text-xs text-neutral-400">Blocked</p>
        </div>
        <div>
          <p className="font-bold text-white">{avgCycleTimeDays.toFixed(1)}d</p>
          <p className="text-xs text-neutral-400">Avg Cycle</p>
        </div>
      </div>
    </div>
  );
};

export default StatsOverlay;
