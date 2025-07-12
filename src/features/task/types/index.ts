import type { TTask } from '../../../shared/types';
export type { TTask } from '../../../shared/types';

export type TaskStatus = 'pending' | 'completed';

export interface TaskEditState {
  isEditing: boolean;
  originalValue: string;
  currentValue: string;
}

export interface TaskActionHandlers {
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleSelection: () => void;
  onStartEdit: () => void;
  onSaveEdit: (value: string) => void;
  onCancelEdit: () => void;
}

export interface TaskBusinessLogic {
  task: TTask;
  isSelected: boolean;
  isCompleted: boolean;
  handlers: TaskActionHandlers;
  editState: TaskEditState;
}