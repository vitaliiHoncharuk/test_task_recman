import { useCallback } from 'react';
import { useTodoContext } from '../../../app/TodoContext';
import { useTaskSelection, useBulkActions } from '../../task';
import type { TColumn } from '../../../shared/types';
import type { ColumnBusinessLogic, ColumnActionHandlers } from '../types';
import { validateColumnTitle, sanitizeColumnTitle, validateTaskDescription } from '../utils/columnValidation';

export function useColumnBusinessLogic(column: TColumn): ColumnBusinessLogic {
  const { addTask, deleteColumn, updateColumn } = useTodoContext();
  
  const { hasSelectedTasks, selectedCount } = useTaskSelection(column);
  const {
    handleSelectAll,
    handleClearSelections,
    handleBulkDelete,
    handleBulkComplete,
    handleBulkIncomplete
  } = useBulkActions(column);

  const handlers: ColumnActionHandlers = {
    onDeleteColumn: useCallback(() => {
      if (confirm(`Are you sure you want to delete the "${column.title}" column?`)) {
        deleteColumn(column.id);
      }
    }, [deleteColumn, column.id, column.title]),

    onEditColumnTitle: useCallback(() => {
      const newTitle = prompt('Enter new column title:', column.title);
      if (newTitle && newTitle.trim() !== column.title) {
        const sanitized = sanitizeColumnTitle(newTitle);
        const validationError = validateColumnTitle(sanitized);
        
        if (!validationError) {
          updateColumn({ ...column, title: sanitized });
        } else {
          alert(validationError);
        }
      }
    }, [updateColumn, column]),

    onAddTask: useCallback((description: string) => {
      const validationError = validateTaskDescription(description);
      if (!validationError) {
        addTask(column.id, description);
      } else {
        throw new Error(validationError);
      }
    }, [addTask, column.id]),

    onSelectAll: handleSelectAll,
    onClearSelections: handleClearSelections,
    onBulkDelete: handleBulkDelete,
    onBulkComplete: handleBulkComplete,
    onBulkIncomplete: handleBulkIncomplete
  };

  return {
    column,
    hasSelectedTasks,
    selectedCount,
    handlers
  };
}