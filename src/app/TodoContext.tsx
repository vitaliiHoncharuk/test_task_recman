import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { TBoard, TTask, TColumn } from '../shared/types';

type TodoAction =
  | { type: 'SET_BOARD'; payload: TBoard }
  | { type: 'ADD_TASK'; payload: { columnId: string; task: TTask } }
  | { type: 'DELETE_TASK'; payload: { columnId: string; taskId: string } }
  | { type: 'UPDATE_TASK'; payload: { columnId: string; task: TTask } }
  | { type: 'TOGGLE_TASK'; payload: { columnId: string; taskId: string } }
  | { type: 'MOVE_TASK'; payload: { sourceColumnId: string; targetColumnId: string; taskId: string; targetIndex: number } }
  | { type: 'ADD_COLUMN'; payload: { column: TColumn } }
  | { type: 'DELETE_COLUMN'; payload: { columnId: string } }
  | { type: 'UPDATE_COLUMN'; payload: { column: TColumn } }
  | { type: 'REORDER_COLUMNS'; payload: { columns: TColumn[] } }
  | { type: 'TOGGLE_TASK_SELECTION'; payload: { columnId: string; taskId: string } }
  | { type: 'SELECT_ALL_TASKS'; payload: { columnId: string } }
  | { type: 'CLEAR_ALL_SELECTIONS'; payload: Record<string, never> }
  | { type: 'BULK_DELETE_SELECTED'; payload: { columnId: string } }
  | { type: 'BULK_TOGGLE_SELECTED'; payload: { columnId: string; completed: boolean } };

interface TodoContextType {
  board: TBoard;
  dispatch: React.Dispatch<TodoAction>;
  addTask: (columnId: string, description: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  updateTask: (columnId: string, task: TTask) => void;
  toggleTask: (columnId: string, taskId: string) => void;
  moveTask: (sourceColumnId: string, targetColumnId: string, taskId: string, targetIndex: number) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  updateColumn: (column: TColumn) => void;
  toggleTaskSelection: (columnId: string, taskId: string) => void;
  selectAllTasks: (columnId: string) => void;
  clearAllSelections: () => void;
  bulkDeleteSelected: (columnId: string) => void;
  bulkToggleSelected: (columnId: string, completed: boolean) => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

const LOCAL_STORAGE_KEY = 'todo-board-data';

function getInitialBoard(): TBoard {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to parse stored board data:', error);
  }

  return {
    columns: [
      { id: 'col-todo', title: 'To Do', tasks: [] },
      { id: 'col-in-progress', title: 'In Progress', tasks: [] },
      { id: 'col-done', title: 'Done', tasks: [] }
    ]
  };
}

function todoReducer(state: TBoard, action: TodoAction): TBoard {
  switch (action.type) {
    case 'SET_BOARD':
      return action.payload;

    case 'ADD_TASK': {
      const { columnId, task } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: [...col.tasks, task] }
            : col
        )
      };
    }

    case 'DELETE_TASK': {
      const { columnId, taskId } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
            : col
        )
      };
    }

    case 'UPDATE_TASK': {
      const { columnId, task } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.map(t => t.id === task.id ? task : t) }
            : col
        )
      };
    }

    case 'TOGGLE_TASK': {
      const { columnId, taskId } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map(task =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                )
              }
            : col
        )
      };
    }

    case 'MOVE_TASK': {
      const { sourceColumnId, targetColumnId, taskId, targetIndex } = action.payload;
      
      const sourceColumn = state.columns.find(col => col.id === sourceColumnId);
      const task = sourceColumn?.tasks.find(t => t.id === taskId);
      
      if (!task) return state;

      return {
        ...state,
        columns: state.columns.map(col => {
          if (col.id === sourceColumnId) {
            return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
          } else if (col.id === targetColumnId) {
            const newTasks = [...col.tasks];
            newTasks.splice(targetIndex, 0, { ...task, selected: false });
            return { ...col, tasks: newTasks };
          }
          return col;
        })
      };
    }

    case 'ADD_COLUMN':
      return {
        ...state,
        columns: [...state.columns, action.payload.column]
      };

    case 'DELETE_COLUMN':
      return {
        ...state,
        columns: state.columns.filter(col => col.id !== action.payload.columnId)
      };

    case 'UPDATE_COLUMN': {
      const { column } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col => col.id === column.id ? column : col)
      };
    }

    case 'REORDER_COLUMNS':
      return {
        ...state,
        columns: action.payload.columns
      };

    case 'TOGGLE_TASK_SELECTION': {
      const { columnId, taskId } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map(task =>
                  task.id === taskId ? { ...task, selected: !task.selected } : task
                )
              }
            : col
        )
      };
    }

    case 'SELECT_ALL_TASKS': {
      const { columnId } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.map(task => ({ ...task, selected: true })) }
            : col
        )
      };
    }

    case 'CLEAR_ALL_SELECTIONS':
      return {
        ...state,
        columns: state.columns.map(col => ({
          ...col,
          tasks: col.tasks.map(task => ({ ...task, selected: false }))
        }))
      };

    case 'BULK_DELETE_SELECTED': {
      const { columnId } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter(task => !task.selected) }
            : col
        )
      };
    }

    case 'BULK_TOGGLE_SELECTED': {
      const { columnId, completed } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map(task =>
                  task.selected ? { ...task, completed, selected: false } : task
                )
              }
            : col
        )
      };
    }

    default:
      return state;
  }
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [board, dispatch] = useReducer(todoReducer, getInitialBoard());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(board));
    } catch (error) {
      console.warn('Failed to save board data to localStorage:', error);
    }
  }, [board]);

  const addTask = (columnId: string, description: string) => {
    const task: TTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      description,
      completed: false,
      selected: false
    };
    dispatch({ type: 'ADD_TASK', payload: { columnId, task } });
  };

  const deleteTask = (columnId: string, taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { columnId, taskId } });
  };

  const updateTask = (columnId: string, task: TTask) => {
    dispatch({ type: 'UPDATE_TASK', payload: { columnId, task } });
  };

  const toggleTask = (columnId: string, taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: { columnId, taskId } });
  };

  const moveTask = (sourceColumnId: string, targetColumnId: string, taskId: string, targetIndex: number) => {
    dispatch({ type: 'MOVE_TASK', payload: { sourceColumnId, targetColumnId, taskId, targetIndex } });
  };

  const addColumn = (title: string) => {
    const column: TColumn = {
      id: `col-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      title,
      tasks: []
    };
    dispatch({ type: 'ADD_COLUMN', payload: { column } });
  };

  const deleteColumn = (columnId: string) => {
    dispatch({ type: 'DELETE_COLUMN', payload: { columnId } });
  };

  const updateColumn = (column: TColumn) => {
    dispatch({ type: 'UPDATE_COLUMN', payload: { column } });
  };

  const toggleTaskSelection = (columnId: string, taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK_SELECTION', payload: { columnId, taskId } });
  };

  const selectAllTasks = (columnId: string) => {
    dispatch({ type: 'SELECT_ALL_TASKS', payload: { columnId } });
  };

  const clearAllSelections = () => {
    dispatch({ type: 'CLEAR_ALL_SELECTIONS', payload: {} as Record<string, never> });
  };

  const bulkDeleteSelected = (columnId: string) => {
    dispatch({ type: 'BULK_DELETE_SELECTED', payload: { columnId } });
  };

  const bulkToggleSelected = (columnId: string, completed: boolean) => {
    dispatch({ type: 'BULK_TOGGLE_SELECTED', payload: { columnId, completed } });
  };

  const value: TodoContextType = {
    board,
    dispatch,
    addTask,
    deleteTask,
    updateTask,
    toggleTask,
    moveTask,
    addColumn,
    deleteColumn,
    updateColumn,
    toggleTaskSelection,
    selectAllTasks,
    clearAllSelections,
    bulkDeleteSelected,
    bulkToggleSelected,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}

