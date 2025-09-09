import React, { useState, useRef, useEffect } from 'react';
import { type Card, CardSlaRisk, type Column } from '../types';
import { BlockerIcon, ClockIcon, MoveLeftIcon, MoveRightIcon } from './Icons';

interface CardProps {
  card: Card;
  onEdit: (cardId: string) => void;
  // For BoardView (swipe to move)
  onMove?: (cardId: string, direction: 'next' | 'prev') => void;
  isFirstColumn?: boolean;
  isLastColumn?: boolean;
  // For Focus/Today views
  onOpenRadialMenu?: (cardId: string, x: number, y: number) => void;
  onToggleBlock?: (cardId: string) => void;
  onPin?: (cardId: string) => void;
  onSuppress?: (cardId: string) => void;
  columns?: Column[];
  context?: 'board' | 'today' | 'focus';
  draggable?: boolean;
}

const CardComponent: React.FC<CardProps> = ({
  card,
  onEdit,
  onMove,
  isFirstColumn,
  isLastColumn,
  onOpenRadialMenu,
  draggable,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // FIX: Use `ReturnType<typeof setTimeout>` for the timeout ID type, as `NodeJS.Timeout` is not available in browser environments.
  const longPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dragThreshold = 50; // pixels to drag before triggering move
  const clickThreshold = 10; // max pixels moved to be considered a click
  const longPressDuration = 500; // ms

  useEffect(() => {
    return () => {
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
      }
    };
  }, []);

  const deltaX = touchStartX !== null && touchCurrentX !== null ? touchCurrentX - touchStartX : 0;

  const getSlaColor = (sla: CardSlaRisk) => {
    switch (sla) {
      case CardSlaRisk.High: return 'border-red-500';
      case CardSlaRisk.Medium: return 'border-yellow-500';
      default: return 'border-transparent';
    }
  };
  
  const getDaysOld = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (days < 1) return 'Today';
    if (days === 1) return '1d ago';
    return `${days}d ago`;
  }
  
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle swipe if onMove is provided
    if (onMove) {
      setTouchStartX(e.touches[0].clientX);
      setTouchCurrentX(e.touches[0].clientX);
    }

    if (onOpenRadialMenu) {
        longPressTimeout.current = setTimeout(() => {
            onOpenRadialMenu(card.id, e.touches[0].clientX, e.touches[0].clientY);
            handleTouchEnd(true); // Reset touch state after menu opens
        }, longPressDuration);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || !onMove) return;
    
    const currentX = e.touches[0].clientX;
    const movedDistance = Math.abs(currentX - touchStartX);

    if (movedDistance > clickThreshold && longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
    }
    
    setTouchCurrentX(currentX);
    if (movedDistance > clickThreshold) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = (forceReset = false) => {
    if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
    }
    
    if (!forceReset) {
      if (isSwiping && onMove) {
        if (deltaX > dragThreshold && !isFirstColumn) {
          onMove(card.id, 'prev');
          if(navigator.vibrate) navigator.vibrate(50);
        } else if (deltaX < -dragThreshold && !isLastColumn) {
          onMove(card.id, 'next');
          if(navigator.vibrate) navigator.vibrate(50);
        }
      } else {
        if (Math.abs(deltaX) <= clickThreshold) {
          onEdit(card.id);
        }
      }
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
    setIsSwiping(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onOpenRadialMenu) {
        e.preventDefault();
        onOpenRadialMenu(card.id, e.clientX, e.clientY);
    }
  };

  // HTML5 Drag & Drop (desktop)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    try {
      e.dataTransfer.setData('text/plain', card.id);
      e.dataTransfer.effectAllowed = 'move';
    } catch {}
  };
  const handleDragEnd = () => setIsDragging(false);

  const transformStyle = isSwiping ? `translateX(${deltaX}px)` : '';
  
  const showPrevIndicator = onMove && deltaX > dragThreshold && !isFirstColumn;
  const showNextIndicator = onMove && deltaX < -dragThreshold && !isLastColumn;

  return (
    <div 
        ref={cardRef} 
        className={`relative ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => handleTouchEnd()}
        onContextMenu={handleContextMenu}
        draggable={!!draggable}
        onDragStart={draggable ? handleDragStart : undefined}
        onDragEnd={draggable ? handleDragEnd : undefined}
    >
        {onMove && (
            <>
            <div className={`absolute inset-0 bg-green-500 rounded-lg flex items-center justify-start px-4 transition-opacity ${showPrevIndicator ? 'opacity-100' : 'opacity-0'}`}>
                <MoveLeftIcon />
            </div>
            <div className={`absolute inset-0 bg-green-500 rounded-lg flex items-center justify-end px-4 transition-opacity ${showNextIndicator ? 'opacity-100' : 'opacity-0'}`}>
                <MoveRightIcon />
            </div>
            </>
        )}
      <div
        className={`bg-neutral-800 p-3 rounded-lg border-l-4 shadow-md transition-transform duration-100 ease-out ${getSlaColor(card.slaRisk)} ${isDragging ? 'opacity-60' : ''}`}
        style={{ transform: transformStyle }}
      >
        {card.blocked && (
          <div className="absolute top-2 right-2 text-red-400">
            <BlockerIcon className="h-5 w-5" />
          </div>
        )}
        <p className="font-semibold text-white pr-6">{card.title}</p>
        
        <div className="flex items-center justify-between mt-2.5 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-3 w-3" />
            <span>{getDaysOld(card.age)}</span>
          </div>
          <div className="flex items-center gap-2">
            {card.effort && (
              <span className="font-bold text-xs bg-neutral-700 text-neutral-300 rounded-full h-5 w-5 flex items-center justify-center">{card.effort}</span>
            )}
            {card.tags.slice(0, 2).map(tag => (
              <span key={tag} className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Click anywhere on the card to edit on desktop */}
      <button
        type="button"
        aria-label="Edit card"
        onClick={() => onEdit(card.id)}
        className="absolute inset-0 rounded-lg focus:outline-none"
        style={{
          // Invisible overlay to capture click without adding visible clutter
          background: 'transparent'
        }}
      />
    </div>
  );
};

export default CardComponent;
