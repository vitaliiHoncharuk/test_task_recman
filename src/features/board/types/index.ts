import type { TBoard, TColumn, TTask } from '../../../shared/types';
import type { CompletionFilter } from './enums';
export type { TBoard, TColumn, TTask } from '../../../shared/types';
export { CompletionFilter } from './enums';

export interface BoardBusinessLogic {
  board: TBoard;
  searchState: SearchState;
  columnFilterState: ColumnFilterState;
  completionFilterState: CompletionFilterState;
  addColumnState: AddColumnState;
  handlers: BoardActionHandlers;
}

export interface SearchState {
  query: string;
  hasQuery: boolean;
  filteredTasks: TTask[];
  clearSearch: () => void;
  setQuery: (query: string) => void;
}

export interface ColumnFilterState {
  selectedColumns: string[];
  columnOptions: DropdownOption[];
  toggleColumnSelection: (columnId: string) => void;
  clearFilters: () => void;
}

export interface CompletionFilterState {
  completionFilter: CompletionFilter;
  setCompletionFilter: (filter: CompletionFilter) => void;
  completionOptions: DropdownOption[];
}

export interface AddColumnState {
  isActive: boolean;
  value: string;
  error: string | null;
  start: () => void;
  cancel: () => void;
  submit: () => void;
  setValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export interface BoardActionHandlers {
  onAddColumn: (title: string) => void;
  onClearAllFilters: () => void;
}

export interface DropdownOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilteredColumnData {
  columns: TColumn[];
  totalTasks: number;
}