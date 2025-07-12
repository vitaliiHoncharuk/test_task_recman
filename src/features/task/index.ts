export { TaskContainer as Task, TaskDisplay, TaskShadow } from './components/TaskContainer';
export { useTaskBusinessLogic } from './hooks/useTaskBusinessLogic';
export { useTaskDragAndDrop } from './hooks/useTaskDragAndDrop';
export { useTaskSelection } from './hooks/useTaskSelection';
export { useBulkActions } from './hooks/useBulkActions';
export type { 
  TaskStatus, 
  TaskEditState, 
  TaskActionHandlers, 
  TaskBusinessLogic 
} from './types';
export { validateTaskDescription, sanitizeTaskDescription } from './utils/taskValidation';