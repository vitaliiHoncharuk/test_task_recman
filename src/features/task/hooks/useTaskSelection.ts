import { useMemo } from 'react';
import type { TColumn, TTask } from '../../../shared/types';

export interface UseTaskSelectionResult {
  selectedTasks: TTask[];
  selectedCount: number;
  hasSelectedTasks: boolean;
  allTasksSelected: boolean;
  someTasksSelected: boolean;
}

export function useTaskSelection(column: TColumn): UseTaskSelectionResult {
  return useMemo(() => {
    const selectedTasks = column.tasks.filter(task => task.selected);
    const selectedCount = selectedTasks.length;
    const totalTasks = column.tasks.length;
    
    return {
      selectedTasks,
      selectedCount,
      hasSelectedTasks: selectedCount > 0,
      allTasksSelected: totalTasks > 0 && selectedCount === totalTasks,
      someTasksSelected: selectedCount > 0 && selectedCount < totalTasks
    };
  }, [column.tasks]);
}