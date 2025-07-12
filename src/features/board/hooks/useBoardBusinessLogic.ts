import { useState } from 'react';
import { useTodoContext } from '../../../app/TodoContext';
import { useSearch, useFormState } from '../../../shared/hooks';
import type { TTask } from '../../../shared/types';
import type { 
  BoardBusinessLogic, 
  DropdownOption, 
  SearchState, 
  ColumnFilterState, 
  CompletionFilterState,
  AddColumnState,
  BoardActionHandlers 
} from '../types';
import { CompletionFilter } from '../types/enums';
import { validateColumnTitle, sanitizeColumnTitle } from '../utils/boardValidation';

export function useBoardBusinessLogic(): BoardBusinessLogic {
  const { board, addColumn } = useTodoContext();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>(CompletionFilter.ALL);

  const searchHook = useSearch<TTask>(
    board.columns.flatMap(col => col.tasks),
    (task, query) => task.description.toLowerCase().includes(query),
    { debounceMs: 300 }
  );

  const searchState: SearchState = {
    query: searchHook.query,
    hasQuery: searchHook.hasQuery,
    filteredTasks: searchHook.filteredItems,
    clearSearch: searchHook.clearSearch,
    setQuery: searchHook.setQuery
  };

  const columnOptions: DropdownOption[] = board.columns.map(column => ({
    value: column.id,
    label: column.title,
    count: column.tasks.length
  }));

  const toggleColumnSelection = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const columnFilterState: ColumnFilterState = {
    selectedColumns,
    columnOptions,
    toggleColumnSelection,
    clearFilters: () => setSelectedColumns([])
  };

  const completionOptions: DropdownOption[] = [
    { value: CompletionFilter.ALL, label: 'All Tasks' },
    { value: CompletionFilter.COMPLETED, label: 'Completed' },
    { value: CompletionFilter.UNCOMPLETED, label: 'Uncompleted' }
  ];

  const completionFilterState: CompletionFilterState = {
    completionFilter,
    setCompletionFilter,
    completionOptions
  };

  const addColumnForm = useFormState('', {
    onSubmit: (title) => {
      const sanitized = sanitizeColumnTitle(title);
      addColumn(sanitized);
    },
    validateFn: (value) => validateColumnTitle(value, board.columns.map(c => c.title))
  });

  const addColumnState: AddColumnState = {
    isActive: addColumnForm.isActive,
    value: addColumnForm.value,
    error: addColumnForm.error,
    start: addColumnForm.start,
    cancel: addColumnForm.cancel,
    submit: addColumnForm.submit,
    setValue: addColumnForm.setValue,
    handleKeyDown: addColumnForm.handleKeyDown
  };

  const handlers: BoardActionHandlers = {
    onAddColumn: (title: string) => {
      const sanitized = sanitizeColumnTitle(title);
      const validationError = validateColumnTitle(sanitized, board.columns.map(c => c.title));
      
      if (!validationError) {
        addColumn(sanitized);
      } else {
        throw new Error(validationError);
      }
    },

    onClearAllFilters: () => {
      searchState.clearSearch();
      columnFilterState.clearFilters();
      setCompletionFilter(CompletionFilter.ALL);
    }
  };

  return {
    board,
    searchState,
    columnFilterState,
    completionFilterState,
    addColumnState,
    handlers
  };
}