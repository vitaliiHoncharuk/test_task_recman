import type { TBoard, TTask } from '../../../shared/types';
import type { FilteredColumnData } from '../types';
import { CompletionFilter } from '../types';

export function applyBoardFilters(
  board: TBoard,
  searchTerm: string,
  selectedColumns: string[],
  searchFilteredTasks: TTask[],
  completionFilter?: CompletionFilter
): FilteredColumnData {
  const filteredColumns = selectedColumns.length > 0 
    ? board.columns.filter(col => selectedColumns.includes(col.id))
    : board.columns;

  const searchFilteredColumns = filteredColumns.map(column => {
    let filteredTasks = searchTerm 
      ? column.tasks.filter(task => 
          searchFilteredTasks.some(t => t.id === task.id)
        )
      : column.tasks;

    if (completionFilter && completionFilter !== CompletionFilter.ALL) {
      filteredTasks = filteredTasks.filter(task => 
        completionFilter === CompletionFilter.COMPLETED ? task.completed : !task.completed
      );
    }

    return {
      ...column,
      tasks: filteredTasks
    };
  });

  const totalTasks = searchFilteredColumns.reduce((acc, col) => acc + col.tasks.length, 0);

  return {
    columns: searchFilteredColumns,
    totalTasks
  };
}