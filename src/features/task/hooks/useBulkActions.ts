import { useCallback } from 'react';
import { useTodoContext } from '../../../app/TodoContext';
import { useTaskSelection } from './useTaskSelection';
import type { TColumn } from '../../../shared/types';

export function useBulkActions(column: TColumn) {
  const { selectAllTasks, bulkDeleteSelected, bulkToggleSelected, clearAllSelections } = useTodoContext();
  const { hasSelectedTasks } = useTaskSelection(column);

  const handleSelectAll = useCallback(() => {
    selectAllTasks(column.id);
  }, [selectAllTasks, column.id]);

  const handleClearSelections = useCallback(() => {
    clearAllSelections();
  }, [clearAllSelections]);

  const handleBulkDelete = useCallback(() => {
    if (hasSelectedTasks) {
      bulkDeleteSelected(column.id);
    }
  }, [bulkDeleteSelected, column.id, hasSelectedTasks]);

  const handleBulkComplete = useCallback(() => {
    if (hasSelectedTasks) {
      bulkToggleSelected(column.id, true);
    }
  }, [bulkToggleSelected, column.id, hasSelectedTasks]);

  const handleBulkIncomplete = useCallback(() => {
    if (hasSelectedTasks) {
      bulkToggleSelected(column.id, false);
    }
  }, [bulkToggleSelected, column.id, hasSelectedTasks]);

  return {
    handleSelectAll,
    handleClearSelections,
    handleBulkDelete,
    handleBulkComplete,
    handleBulkIncomplete
  };
}