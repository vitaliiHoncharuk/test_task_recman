export { ColumnContainer as Column, ColumnDisplay } from './components/ColumnContainer';

export { useColumnBusinessLogic } from './hooks/useColumnBusinessLogic';
export { useColumnDragAndDrop } from './hooks/useColumnDragAndDrop';

export type { 
  ColumnBusinessLogic, 
  ColumnActionHandlers, 
  ColumnState 
} from './types';

export { 
  validateColumnTitle, 
  sanitizeColumnTitle,
  validateTaskDescription as validateColumnTaskDescription 
} from './utils/columnValidation';