import React, { useState, useRef, useMemo } from 'react';
import { AddIcon } from './Icons';
import { type Column, type Effort } from '../types';

interface QuickAddData {
  title: string;
  tags: string[];
  dueDate?: string;
  effort?: Effort;
  columnName?: string;
}

interface QuickAddBarProps {
  onAddCard: (data: QuickAddData) => void;
  columns: Column[];
}

const parseDateString = (dateStr: string): string | undefined => {
    const lowerStr = dateStr.toLowerCase();
    const now = new Date();
    if (lowerStr === 'today') {
        return now.toISOString();
    }
    if (lowerStr === 'tomorrow') {
        now.setDate(now.getDate() + 1);
        return now.toISOString();
    }
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
    }
    return undefined;
};

const parseQuickAddText = (text: string): QuickAddData => {
    let title = text;
    const tags: string[] = [];
    let dueDate: string | undefined;
    let effort: Effort | undefined;
    let columnName: string | undefined;

    const tokenRegex = /(#\w+)|(!\S+)|(\^[smlSML])|(>\w+)/g;
    
    title = title.replace(tokenRegex, (match) => {
        if (match.startsWith('#')) {
            tags.push(match.substring(1));
        } else if (match.startsWith('!')) {
            if (!dueDate) dueDate = parseDateString(match.substring(1));
        } else if (match.startsWith('^')) {
            if (!effort) {
                const effortChar = match.substring(1).toUpperCase();
                if (effortChar === 'S' || effortChar === 'M' || effortChar === 'L') {
                    effort = effortChar;
                }
            }
        } else if (match.startsWith('>')) {
            if (!columnName) columnName = match.substring(1).toLowerCase();
        }
        return '';
    }).trim();

    return { title: title.trim(), tags, dueDate, effort, columnName };
};

const Chip: React.FC<{label: string}> = ({label}) => (
    <span className="text-xs bg-neutral-700 px-2 py-1 rounded-full whitespace-nowrap">{label}</span>
);

const QuickAddBar: React.FC<QuickAddBarProps> = ({ onAddCard, columns }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const parsedData = useMemo(() => parseQuickAddText(inputValue), [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedData.title) {
      onAddCard(parsedData);
      setInputValue('');
      inputRef.current?.focus();
    }
  };
  
  const getColumnTitle = (columnName?: string) => {
      if (!columnName) return null;
      const col = columns.find(c => c.title.toLowerCase().startsWith(columnName));
      return col?.title || null;
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 bg-neutral-950/80 backdrop-blur-sm border-t border-neutral-800">
      <form onSubmit={handleSubmit} >
        <div 
          className="flex items-center gap-2 p-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="New card... (#tag !due ^effort >column)"
            className="flex-1 p-3 bg-neutral-800 rounded-full text-white placeholder-neutral-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-500 transition-colors flex items-center justify-center disabled:bg-neutral-600"
            aria-label="Add new card"
            disabled={!parsedData.title}
          >
            <AddIcon />
          </button>
        </div>
        {(parsedData.tags.length > 0 || parsedData.dueDate || parsedData.effort || parsedData.columnName) && (
            <div className="flex items-center gap-2 px-4 pb-2 -mt-1 overflow-x-auto">
                {parsedData.tags.map(tag => <Chip key={tag} label={`#${tag}`} />)}
                {parsedData.dueDate && <Chip label={`!${new Date(parsedData.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}`} />}
                {parsedData.effort && <Chip label={`^${parsedData.effort}`} />}
                {parsedData.columnName && getColumnTitle(parsedData.columnName) && <Chip label={`>${getColumnTitle(parsedData.columnName)}`} />}
            </div>
        )}
      </form>
    </div>
  );
};

export default QuickAddBar;