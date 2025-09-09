import React, { useRef } from 'react';
import { type Card, type Column as ColumnType } from '../types';
import Column from './Column';

interface BoardViewProps {
  columns: ColumnType[];
  cardsByColumn: { [key: string]: Card[] };
  onEditCard: (cardId: string) => void;
  onMoveCard: (cardId: string, direction: 'next' | 'prev') => void;
  onDropCard: (cardId: string, targetColumnId: string) => void;
  onAddCardIn: (columnId: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ 
  columns, 
  cardsByColumn, 
  onEditCard,
  onMoveCard,
  onDropCard,
  onAddCardIn,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div ref={scrollContainerRef} className="flex-1 flex overflow-x-auto snap-x snap-mandatory pt-4 pb-24">
        {columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            cards={cardsByColumn[column.id] || []}
            onEditCard={onEditCard}
            onMoveCard={onMoveCard}
            onDropCard={onDropCard}
            onAddCardIn={onAddCardIn}
            isFirst={index === 0}
            isLast={index === columns.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardView;
