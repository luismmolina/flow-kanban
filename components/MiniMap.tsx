import React from 'react';
import { type Column, type Card } from '../types';

interface MiniMapProps {
  columns: Column[];
  cardsByColumn: { [key: string]: Card[] };
  onColumnJump: (columnId: string) => void;
}

const MiniMap: React.FC<MiniMapProps> = ({ columns, cardsByColumn, onColumnJump }) => {
  return (
    <div className="flex-shrink-0 bg-neutral-900/80 backdrop-blur-sm px-3 pt-2 pb-1 flex items-center gap-2 z-20 border-b border-neutral-800">
      {columns.map(column => {
        const wip = cardsByColumn[column.id]?.length || 0;
        const limit = column.wipLimit;
        const isOverWip = limit ? wip > limit : false;

        return (
          <div key={column.id} className="flex-1" onClick={() => onColumnJump(column.id)}>
            <div className="flex items-center justify-between text-xs mb-1 px-1">
                <span className="text-neutral-400 font-semibold truncate">{column.title}</span>
                <span className={`font-mono ${isOverWip ? 'text-red-400' : 'text-neutral-500'}`}>{wip}{limit ? `/${limit}`: ''}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden cursor-pointer">
              {limit && (
                <div
                  className={`h-full rounded-full ${isOverWip ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((wip / limit) * 100, 100)}%` }}
                ></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MiniMap;