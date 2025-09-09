import React, { useState, useCallback } from 'react';
import { type Card, type Column as ColumnType } from '../types';
import CardComponent from './Card';
import { AddIcon } from './Icons';

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  onEditCard: (cardId: string) => void;
  onMoveCard: (cardId: string, direction: 'next' | 'prev') => void;
  onDropCard: (cardId: string, targetColumnId: string) => void;
  onAddCardIn: (columnId: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

const Column = React.forwardRef<HTMLDivElement, ColumnProps>(({ 
  column,
  cards,
  onEditCard,
  onMoveCard,
  onDropCard,
  onAddCardIn,
  isFirst,
  isLast,
}, ref) => {
  const wip = cards.length;
  const wipLimit = column.wipLimit;
  const isOverWip = wipLimit !== undefined && wip > wipLimit;

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      onDropCard(cardId, column.id);
    }
    setIsDragOver(false);
  }, [column.id, onDropCard]);

  return (
    <div ref={ref} className="w-[85vw] md:w-[400px] flex-shrink-0 snap-center mx-2 flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between p-3 rounded-t-lg bg-neutral-850 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-white">{column.title}</h2>
          <span
            className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              isOverWip ? 'bg-red-500/20 text-red-300' : 'bg-neutral-700 text-neutral-300'
            }`}
          >
            {wip}
            {wipLimit !== undefined && `/${wipLimit}`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddCardIn(column.id)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm"
        >
          <AddIcon />
          <span>Add</span>
        </button>
      </div>
      <div
        className={`flex-1 overflow-y-auto rounded-b-lg p-2 space-y-3 border-2 ${isDragOver ? 'border-blue-500 bg-neutral-900' : 'border-transparent bg-neutral-900'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {cards.map(card => (
          <CardComponent
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onMove={onMoveCard}
            isFirstColumn={isFirst}
            isLastColumn={isLast}
            draggable
          />
        ))}
      </div>
    </div>
  );
});

export default Column;
