import { useCallback } from 'react';
import { useTodoContext } from '../../../app/TodoContext';
import { useFormState } from '../../../shared/hooks';
import type { TTask } from '../../../shared/types';
import type { TaskBusinessLogic, TaskActionHandlers } from '../types';
import { validateTaskDescription, sanitizeTaskDescription } from '../utils/taskValidation';

export function useTaskBusinessLogic(
  task: TTask, 
  columnId: string
): TaskBusinessLogic {
  const { toggleTask, updateTask, deleteTask, toggleTaskSelection } = useTodoContext();

  const editForm = useFormState(task.description, {
    onSubmit: (description) => {
      const sanitized = sanitizeTaskDescription(description);
      updateTask(columnId, { ...task, description: sanitized });
    },
    validateFn: validateTaskDescription
  });

  const handlers: TaskActionHandlers = {
    onToggleComplete: useCallback(() => {
      toggleTask(columnId, task.id);
    }, [toggleTask, columnId, task.id]),

    onEdit: useCallback(() => {
      editForm.start();
    }, [editForm]),

    onDelete: useCallback(() => {
      deleteTask(columnId, task.id);
    }, [deleteTask, columnId, task.id]),

    onToggleSelection: useCallback(() => {
      toggleTaskSelection(columnId, task.id);
    }, [toggleTaskSelection, columnId, task.id]),

    onStartEdit: useCallback(() => {
      editForm.start();
    }, [editForm]),

    onSaveEdit: useCallback((value: string) => {
      const sanitized = sanitizeTaskDescription(value);
      const validationError = validateTaskDescription(sanitized);
      
      if (!validationError) {
        updateTask(columnId, { ...task, description: sanitized });
        editForm.cancel();
      }
    }, [updateTask, columnId, task, editForm]),

    onCancelEdit: useCallback(() => {
      editForm.cancel();
    }, [editForm])
  };

  return {
    task,
    isSelected: !!task.selected,
    isCompleted: task.completed,
    handlers,
    editState: {
      isEditing: editForm.isActive,
      originalValue: task.description,
      currentValue: editForm.value
    }
  };
}