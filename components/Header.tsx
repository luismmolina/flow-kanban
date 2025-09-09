import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800 p-3 flex items-center justify-center z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-white">Flow Kanban</h1>
      </div>
    </header>
  );
};

export default Header;