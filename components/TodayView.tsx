import React from 'react';
import { type Card, type Column } from '../types';
import CardComponent from './Card';

interface TodayViewProps {
  todayCards: {
    doing: Card[];
    pinned: Card[];
    derived: Card[];
  };
  columns: Column[];
  onEditCard: (cardId: string) => void;
  onMoveCard: (cardId: string, newColumnId: string) => boolean;
  onOpenRadialMenu: (cardId: string, x: number, y: number) => void;
  onToggleBlock: (cardId: string) => void;
  onPinCard: (cardId: string) => void;
  onSuppressCard: (cardId: string) => void;
}

const TodayView: React.FC<TodayViewProps> = ({ 
    todayCards, 
    columns,
    onEditCard, 
    onMoveCard,
    onOpenRadialMenu,
    onToggleBlock,
    onPinCard,
    onSuppressCard
}) => {
  const { doing, pinned, derived } = todayCards;
  
  const doingColumn = columns.find(c => c.title === 'In Progress');
  const isDoingFull = doingColumn?.wipLimit !== undefined && doing.length >= doingColumn.wipLimit;

  const handleStartNext = () => {
    if (derived.length > 0 && doingColumn && !isDoingFull) {
      onMoveCard(derived[0].id, doingColumn.id);
    }
  };

  const renderCardList = (cards: Card[], isTodayContext: boolean = false) => {
    if (cards.length === 0) return null;
    return cards.map(card => {
      const cardColumn = columns.find(c => c.id === card.columnId);
      const columnIndex = columns.findIndex(c => c.id === card.columnId);
      return (
        <CardComponent
          key={card.id}
          card={card}
          onEdit={onEditCard}
          onMove={onMoveCard}
          onOpenRadialMenu={onOpenRadialMenu}
          onToggleBlock={onToggleBlock}
          onPin={onPinCard}
          onSuppress={onSuppressCard}
          isFirstColumn={columnIndex === 0}
          isLastColumn={columnIndex === columns.length - 1}
          columns={columns}
          context={isTodayContext ? 'today' : 'board'}
        />
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-36">
      <div className="p-4 sticky top-0 bg-neutral-950/80 backdrop-blur-sm z-20 border-b border-neutral-800">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Today</h2>
            <button 
                onClick={handleStartNext}
                disabled={isDoingFull || derived.length === 0}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full text-sm transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed"
            >
                Start Next
            </button>
        </div>
        <p className="text-sm text-neutral-400 mt-1 font-mono">
            Doing: {doing.length}{doingColumn?.wipLimit ? `/${doingColumn.wipLimit}`: ''} &middot; Pinned: {pinned.length} &middot; Up Next: {derived.length}
        </p>
         {isDoingFull && <p className="text-xs text-yellow-400 mt-2">Finish 1 to free Doing ({doing.length}/{doingColumn?.wipLimit})</p>}
      </div>
      
      <div className="p-4 space-y-4">
        {doing.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-2 px-1">Doing</h3>
            <div className="space-y-3">{renderCardList(doing, true)}</div>
          </section>
        )}

        {pinned.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-2 px-1">Pinned</h3>
            <div className="space-y-3">{renderCardList(pinned, true)}</div>
          </section>
        )}

        {derived.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-2 px-1">Up Next</h3>
            <div className="space-y-3">{renderCardList(derived, true)}</div>
          </section>
        )}
        
        {doing.length === 0 && pinned.length === 0 && derived.length === 0 && (
             <div className="text-center py-10">
                <p className="text-neutral-500">Nothing on the agenda for today.</p>
                <p className="text-sm text-neutral-600 mt-1">Add cards to your Backlog or To Do list.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TodayView;