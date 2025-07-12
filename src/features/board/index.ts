export { BoardContainer as Board, BoardDisplay } from './components/BoardContainer';

export { useBoardBusinessLogic } from './hooks/useBoardBusinessLogic';
export { useBoardDragAndDrop } from './hooks/useBoardDragAndDrop';

export type { 
  BoardBusinessLogic,
  SearchState,
  ColumnFilterState,
  AddColumnState,
  BoardActionHandlers,
  DropdownOption,
  FilteredColumnData
} from './types';

export { 
  validateColumnTitle as validateBoardColumnTitle, 
  sanitizeColumnTitle as sanitizeBoardColumnTitle 
} from './utils/boardValidation';
export { applyBoardFilters } from './utils/boardFilters';