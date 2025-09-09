import React from 'react';
import { type Card, type Column } from '../types';
import CardComponent from './Card';

interface FocusViewProps {
  column: Column;
  cards: Card[];
  columns: Column[];
  onEditCard: (cardId: string) => void;
  onMoveCard: (cardId: string, newColumnId: string) => boolean;
  onOpenRadialMenu: (cardId: string, x: number, y: number) => void;
  onToggleBlock: (cardId: string) => void;
}

const FocusView: React.FC<FocusViewProps> = ({ 
    column, 
    cards, 
    columns,
    onEditCard, 
    onMoveCard,
    onOpenRadialMenu,
    onToggleBlock
}) => {
  const sortedCards = [...cards].sort((a, b) => (a.slaRisk > b.slaRisk ? -1 : 1));
  const columnIndex = columns.findIndex(c => c.id === column.id);
  const isFirst = columnIndex === 0;
  const isLast = columnIndex === columns.length - 1;

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-36">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white">{column.title}</h2>
        <p className="text-neutral-400">
          {cards.length} cards
          {column.wipLimit && ` / ${column.wipLimit} WIP limit`}
        </p>
      </div>
      <div className="space-y-3">
        {sortedCards.length > 0 ? (
            sortedCards.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onMove={onMoveCard}
                onOpenRadialMenu={onOpenRadialMenu}
                onToggleBlock={onToggleBlock}
                isFirstColumn={isFirst}
                isLastColumn={isLast}
                columns={columns}
              />
            ))
        ) : (
            <div className="text-center py-10">
                <p className="text-neutral-500">No cards in this column.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FocusView;