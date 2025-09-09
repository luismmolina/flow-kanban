import React from 'react';
import { type Card, type Column as ColumnType } from '../types';
import CardComponent from './Card';

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  onEditCard: (cardId: string) => void;
  onMoveCard: (cardId: string, direction: 'next' | 'prev') => void;
  isFirst: boolean;
  isLast: boolean;
}

const Column = React.forwardRef<HTMLDivElement, ColumnProps>(({
  column,
  cards,
  onEditCard,
  onMoveCard,
  isFirst,
  isLast,
}, ref) => {
  const wip = cards.length;
  const wipLimit = column.wipLimit;
  const isOverWip = wipLimit !== undefined && wip > wipLimit;

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
      </div>
      <div className="flex-1 overflow-y-auto bg-neutral-900 rounded-b-lg p-2 space-y-3">
        {cards.map(card => (
          <CardComponent
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onMove={onMoveCard}
            isFirstColumn={isFirst}
            isLastColumn={isLast}
          />
        ))}
      </div>
    </div>
  );
});

export default Column;