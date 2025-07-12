import type { TColumn } from '../../../shared/types';
export type { TColumn } from '../../../shared/types';

export interface ColumnBusinessLogic {
  column: TColumn;
  hasSelectedTasks: boolean;
  selectedCount: number;
  handlers: ColumnActionHandlers;
}

export interface ColumnActionHandlers {
  onDeleteColumn: () => void;
  onEditColumnTitle: () => void;
  onAddTask: (description: string) => void;
  onSelectAll: () => void;
  onClearSelections: () => void;
  onBulkDelete: () => void;
  onBulkComplete: () => void;
  onBulkIncomplete: () => void;
}

export type ColumnState =
  | { type: 'is-task-over'; isOverChildTask: boolean; dragging: DOMRect }
  | { type: 'is-column-over' }
  | { type: 'idle' }
  | { type: 'is-dragging' };