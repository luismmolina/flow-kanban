import React from 'react';
import { type View } from '../types';
import { BoardIcon, FocusIcon, TodayIcon, ChartIcon } from './Icons';

interface BottomActionBarProps {
  currentView: View;
  onSetView: (view: View) => void;
  onToggleStats: () => void;
  isFocusViewAvailable: boolean;
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({ currentView, onSetView, onToggleStats, isFocusViewAvailable }) => {
  const views: { id: View; name: string; icon: React.ReactNode }[] = [
    { id: 'board', name: 'Board', icon: <BoardIcon /> },
    { id: 'focus', name: 'Focus', icon: <FocusIcon /> },
    { id: 'today', name: 'Today', icon: <TodayIcon /> },
  ];

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 h-16 z-40 bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-between h-full px-3">
        <div className="flex items-center bg-neutral-800 rounded-full p-1 text-sm">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => onSetView(view.id)}
              disabled={view.id === 'focus' && !isFocusViewAvailable}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                currentView === view.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {view.icon}
              <span className="hidden sm:inline">{view.name}</span>
            </button>
          ))}
        </div>
        <button onClick={onToggleStats} className="p-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors">
          <ChartIcon />
        </button>
      </div>
    </footer>
  );
};

export default BottomActionBar;