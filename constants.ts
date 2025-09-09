import { type Column, type Card, CardSlaRisk } from './types';

export const initialColumns: Column[] = [
  { id: 'col-1', title: 'Backlog', color: 'border-neutral-500' },
  { id: 'col-2', title: 'To Do', wipLimit: 5, color: 'border-gray-500' },
  { id: 'col-3', title: 'In Progress', wipLimit: 3, color: 'border-blue-500' },
  { id: 'col-4', title: 'Review', wipLimit: 2, color: 'border-purple-500' },
  { id: 'col-5', title: 'Done', color: 'border-green-500' },
];

const now = Date.now();
const d = (days: number) => 1000 * 60 * 60 * 24 * days;

export const initialCards: Card[] = [
  { id: 'card-1', title: 'Design the new login flow', columnId: 'col-1', age: now - d(5), blocked: false, slaRisk: CardSlaRisk.Low, tags: ['UI', 'Design'], effort: 'M' },
  { id: 'card-2', title: 'Develop user authentication API', columnId: 'col-2', age: now - d(2), blocked: false, slaRisk: CardSlaRisk.Medium, tags: ['API', 'Backend'], effort: 'L' },
  { id: 'card-3', title: 'Fix critical bug in payment gateway', columnId: 'col-3', age: now - d(1), blocked: true, slaRisk: CardSlaRisk.High, dueDate: new Date(now - d(2)).toISOString(), tags: ['Bug', 'Payments'], effort: 'M' },
  { id: 'card-4', title: 'Implement password reset functionality', columnId: 'col-3', age: now, blocked: false, slaRisk: CardSlaRisk.Medium, tags: ['Feature'], effort: 'S' },
  { id: 'card-5', title: 'Write documentation for the new API', columnId: 'col-2', age: now - d(3), blocked: false, slaRisk: CardSlaRisk.Low, tags: ['Docs'] },
  { id: 'card-6', title: 'Review marketing copy for landing page', columnId: 'col-4', age: now - d(0.5), blocked: false, slaRisk: CardSlaRisk.Low, tags: ['Content'], effort: 'S' },
  { id: 'card-7', title: 'Deploy staging environment', columnId: 'col-4', age: now - d(1), blocked: false, slaRisk: CardSlaRisk.High, dueDate: new Date(now + d(1)).toISOString(), tags: ['DevOps'] },
  { id: 'card-8', title: 'Onboard new team member', columnId: 'col-1', age: now - d(10), blocked: false, slaRisk: CardSlaRisk.Low, tags: ['HR'] },
  { id: 'card-9', title: 'Refactor state management', columnId: 'col-3', age: now - d(2), blocked: false, slaRisk: CardSlaRisk.Medium, tags: ['TechDebt'], effort: 'L' },
  { id: 'card-10', title: 'Setup CI/CD pipeline', columnId: 'col-2', age: now - d(4), blocked: false, slaRisk: CardSlaRisk.Low, tags: ['DevOps'], effort: 'M' },
  { id: 'card-11', title: 'Test user profile page on mobile', columnId: 'col-2', age: now - d(1), blocked: false, slaRisk: CardSlaRisk.Low, tags: ['QA', 'Mobile'] },
];