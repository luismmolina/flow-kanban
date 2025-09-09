import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { type Card, type Column, CardSlaRisk } from './types';
import { initialCards, initialColumns } from './constants';
import BoardView from './components/BoardView';
import CardSheet from './components/CardSheet';
import { AddIcon } from './components/Icons';

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(() => {
    try {
      const savedCards = localStorage.getItem('flow-kanban-cards');
      return savedCards ? JSON.parse(savedCards) : initialCards;
    } catch (error) {
      console.error('Could not load cards from local storage', error);
      return initialCards;
    }
  });
  const [columns] = useState<Column[]>(initialColumns);
  
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isCreatingCard, setIsCreatingCard] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('flow-kanban-cards', JSON.stringify(cards));
    } catch (error) {
      console.error('Could not save cards to local storage', error);
    }
  }, [cards]);
  
  const activeCards = useMemo(() => cards.filter(c => !c.isArchived), [cards]);

  const cardsByColumn = useMemo(() => {
    const grouped: { [key: string]: Card[] } = {};
    columns.forEach(col => grouped[col.id] = []);
    activeCards.forEach(card => {
      if (grouped[card.columnId]) {
        grouped[card.columnId].push(card);
      }
    });
    return grouped;
  }, [activeCards, columns]);

  const handleSaveCard = (cardToSave: Card) => {
    setCards(prev => {
      const exists = prev.some(c => c.id === cardToSave.id);
      if (exists) {
        return prev.map(c => c.id === cardToSave.id ? cardToSave : c);
      }
      return [...prev, cardToSave];
    });
    setEditingCard(null);
    setIsCreatingCard(false);
  };
  
  const handleEditCard = (cardId: string) => {
    const cardToEdit = cards.find(c => c.id === cardId);
    if (cardToEdit) {
      setEditingCard(cardToEdit);
      setIsCreatingCard(false);
    }
  };

  const handleArchiveCard = useCallback((cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? {...c, isArchived: true} : c));
    setEditingCard(null);
  }, []);

  const handleAddNewCard = () => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: '',
      columnId: columns[0].id, // Default to first column
      age: Date.now(),
      blocked: false,
      slaRisk: CardSlaRisk.Low,
      tags: [],
    };
    setEditingCard(newCard);
    setIsCreatingCard(true);
  };

  const handleMoveCard = useCallback((cardId: string, direction: 'next' | 'prev') => {
    setCards(prevCards => {
      const cardToMove = prevCards.find(c => c.id === cardId);
      if (!cardToMove) return prevCards;

      const currentColumnIndex = columns.findIndex(c => c.id === cardToMove.columnId);
      if (currentColumnIndex === -1) return prevCards;

      const newColumnIndex = direction === 'next' ? currentColumnIndex + 1 : currentColumnIndex - 1;

      if (newColumnIndex < 0 || newColumnIndex >= columns.length) {
        return prevCards; // Can't move further
      }

      const newColumn = columns[newColumnIndex];
      const cardsInNewColumn = prevCards.filter(c => c.columnId === newColumn.id && !c.isArchived).length;

      if (newColumn.wipLimit !== undefined && cardsInNewColumn >= newColumn.wipLimit) {
        // For now, just block the move. A toast message would be a good addition later.
        console.warn(`WIP limit of ${newColumn.wipLimit} reached for column "${newColumn.title}". Move blocked.`);
        return prevCards;
      }

      return prevCards.map(c => 
        c.id === cardId 
          ? { ...c, columnId: newColumn.id, age: Date.now() } 
          : c
      );
    });
  }, [columns]);

  const handleDropCard = useCallback((cardId: string, targetColumnId: string) => {
    setCards(prevCards => {
      const cardToMove = prevCards.find(c => c.id === cardId);
      if (!cardToMove) return prevCards;

      const targetColumn = columns.find(c => c.id === targetColumnId);
      if (!targetColumn) return prevCards;

      const cardsInTarget = prevCards.filter(c => c.columnId === targetColumn.id && !c.isArchived).length;
      if (targetColumn.wipLimit !== undefined && cardsInTarget >= targetColumn.wipLimit) {
        console.warn(`WIP limit of ${targetColumn.wipLimit} reached for column "${targetColumn.title}". Drop blocked.`);
        return prevCards;
      }

      return prevCards.map(c => c.id === cardId ? { ...c, columnId: targetColumn.id, age: Date.now() } : c);
    });
  }, [columns]);

  const handleAddCardIn = useCallback((columnId: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: '',
      columnId,
      age: Date.now(),
      blocked: false,
      slaRisk: CardSlaRisk.Low,
      tags: [],
    };
    setEditingCard(newCard);
    setIsCreatingCard(true);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-950 font-sans">
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <BoardView 
          columns={columns} 
          cardsByColumn={cardsByColumn}
          onEditCard={handleEditCard}
          onMoveCard={handleMoveCard}
          onDropCard={handleDropCard}
          onAddCardIn={handleAddCardIn}
        />
      </main>

      <button
        onClick={handleAddNewCard}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform hover:scale-110 active:scale-95 z-40"
        aria-label="Add new card"
        title="Quick add"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))', paddingRight: 'calc(1rem + env(safe-area-inset-right))' }}
      >
        <AddIcon />
      </button>


      {(editingCard) && (
        <CardSheet
          card={editingCard}
          isCreating={isCreatingCard}
          onSave={handleSaveCard}
          onClose={() => setEditingCard(null)}
          onArchive={handleArchiveCard}
          columns={columns}
        />
      )}
    </div>
  );
};

export default App;
