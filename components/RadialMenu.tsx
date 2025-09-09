import React, { useEffect, useRef } from 'react';
import { type Card } from '../types';
import { BlockerIcon, EditIcon, BlockerSolidIcon, ArchiveIcon, DuplicateIcon, MoveToIcon, PinIcon, SnoozeIcon } from './Icons';

interface RadialMenuProps {
  card: Card;
  position: { x: number; y: number };
  onClose: () => void;
  onToggleBlock: (cardId: string) => void;
  onEdit: (cardId: string) => void;
  onArchive: (cardId: string) => void;
  onDuplicate: (cardId: string) => void;
  onMoveTo: (cardId: string) => void;
  onPin: (cardId: string) => void;
  onSuppress: (cardId: string) => void;
}

const RadialMenu: React.FC<RadialMenuProps> = ({ card, position, onClose, onToggleBlock, onEdit, onArchive, onDuplicate, onMoveTo, onPin, onSuppress }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  const doneColumnTitle = 'Done'; // Assuming 'Done' is the title of the final column

  const menuItems = [
    { 
      label: card.blocked ? 'Unblock' : 'Block', 
      icon: card.blocked ? <BlockerSolidIcon className="text-white" /> : <BlockerIcon className="text-white" />,
      action: () => onToggleBlock(card.id),
      color: card.blocked ? 'bg-green-500' : 'bg-red-500',
    },
    { 
      label: 'Edit', 
      icon: <EditIcon />, 
      action: () => onEdit(card.id),
      color: 'bg-blue-500',
    },
    card.todayState !== 'pinned' && { 
      label: 'Pin to Today', 
      icon: <PinIcon />, 
      action: () => onPin(card.id),
      color: 'bg-cyan-500',
    },
    card.todayState === 'pinned' && { 
      label: 'Remove Pin', 
      icon: <PinIcon />, 
      action: () => onPin(card.id),
      color: 'bg-cyan-700',
    },
    card.todayState !== 'suppressed' && { 
      label: 'Hide for today', 
      icon: <SnoozeIcon />, 
      action: () => onSuppress(card.id),
      color: 'bg-neutral-500',
    },
    card.todayState === 'suppressed' && { 
      label: 'Unhide', 
      icon: <SnoozeIcon />, 
      action: () => onSuppress(card.id),
      color: 'bg-neutral-400',
    },
     { 
      label: 'Move', 
      icon: <MoveToIcon />, 
      action: () => onMoveTo(card.id),
      color: 'bg-purple-500',
    },
     { 
      label: 'Duplicate', 
      icon: <DuplicateIcon />, 
      action: () => onDuplicate(card.id),
      color: 'bg-yellow-500',
    },
    { 
      label: 'Archive', 
      icon: <ArchiveIcon />, 
      action: () => onArchive(card.id),
      color: 'bg-gray-600',
    },
  ].filter(Boolean) as any[];

  const radius = 90;
  const angleStep = (Math.PI * 1.8) / menuItems.length;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50"
      onClick={onClose}
      onContextMenu={(e) => { e.preventDefault(); onClose(); }}
    >
      <div 
        ref={menuRef}
        className="absolute"
        style={{ left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}
      >
        {menuItems.map((item, index) => {
          const angle = index * angleStep - (Math.PI / 2) - (angleStep * (menuItems.length-1) / 2) ; 
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          
          return (
            <div 
              key={item.label}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out"
              style={{ 
                  transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); item.action(); }}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 ${item.color} hover:scale-110 transition-transform`}
                aria-label={item.label}
              >
                {item.icon}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadialMenu;