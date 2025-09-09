export enum CardSlaRisk {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

// FIX: Export the View type so it can be imported and used in BottomActionBar.tsx.
export type View = 'board' | 'focus' | 'today';

// FIX: Export the Effort type so it can be imported and used in other components like CardSheet.
export type Effort = 'S' | 'M' | 'L';

export interface Card {
  id:string;
  title: string;
  columnId: string;
  age: number; // timestamp of last move
  blocked: boolean;
  slaRisk: CardSlaRisk;
  dueDate?: string;
  tags: string[];
  effort?: Effort;
  isArchived?: boolean;
  todayState?: 'pinned' | 'suppressed' | 'derived';
  pinnedAt?: number;
}

export interface Column {
  id: string;
  title: string;
  wipLimit?: number;
  color?: string;
}