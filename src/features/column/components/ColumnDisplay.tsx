import { memo } from 'react';

import { Task as TaskContainer, TaskShadow } from '../../task';
import { Button, Input } from '../../../shared/components';
import { useFormState } from '../../../shared/hooks';
import { blockBoardPanningAttr } from '../../../shared/utils';
import type { TColumn } from '../../../shared/types';
import type { ColumnBusinessLogic, ColumnState } from '../types';
import { validateTaskDescription } from '../utils/columnValidation';
import './Column.css';

const stateStyles: { [Key in ColumnState['type']]: string } = {
  idle: 'idle',
  'is-task-over': 'is-task-over',
  'is-dragging': 'is-dragging',
  'is-column-over': 'is-column-over',
};

const TaskList = memo(function TaskList({ column }: { column: TColumn }) {
  return (
    <>
      {column.tasks.map((task) => (
        <TaskContainer key={task.id} task={task} columnId={column.id} />
      ))}
    </>
  );
});

interface ColumnDisplayProps {
  business: ColumnBusinessLogic;
  state: ColumnState;
  refs: {
    scrollableRef: React.RefObject<HTMLDivElement | null>;
    outerFullHeightRef: React.RefObject<HTMLDivElement | null>;
    headerRef: React.RefObject<HTMLDivElement | null>;
    innerRef: React.RefObject<HTMLDivElement | null>;
  };
}

export function ColumnDisplay({ business, state, refs }: ColumnDisplayProps) {
  const { column, hasSelectedTasks, selectedCount, handlers } = business;

  const addTaskForm = useFormState('', {
    onSubmit: (description) => {
      handlers.onAddTask(description);
    },
    validateFn: validateTaskDescription
  });

  return (
    <div className="column-container" ref={refs.outerFullHeightRef}>
      <div
        className={`column-card ${stateStyles[state.type]}`}
        ref={refs.innerRef}
        {...{ [blockBoardPanningAttr]: true }}
      >
        <div
          className={`column-content ${state.type === 'is-column-over' ? 'invisible' : ''}`}
        >
          <div className="column-header" ref={refs.headerRef}>
            <div 
              className="column-title"
              onClick={handlers.onEditColumnTitle}
              title="Click to edit column title"
            >
              {column.title}
            </div>
            <div className="column-header-actions">
              <span className="column-task-count">
                {column.tasks.length}
              </span>
              <Button
                variant="danger"
                size="small"
                onClick={handlers.onDeleteColumn}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18m-2 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                }
                title="Delete column"
              />
            </div>
          </div>

          {hasSelectedTasks && (
            <div className="bulk-actions">
              <div className="bulk-actions-info">
                {selectedCount} task{selectedCount > 1 ? 's' : ''} selected
              </div>
              <div className="bulk-actions-buttons">
                <Button
                  variant="success"
                  size="small"
                  onClick={handlers.onBulkComplete}
                  icon="✓"
                >
                  Complete
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handlers.onBulkIncomplete}
                  icon="↺"
                >
                  Incomplete
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={handlers.onBulkDelete}
                  icon="×"
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handlers.onClearSelections}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {column.tasks.length > 0 && (
            <div className="select-all-container">
              <Button
                variant="ghost"
                size="small"
                onClick={handlers.onSelectAll}
              >
                Select All ({column.tasks.length})
              </Button>
            </div>
          )}

          <div
            className="tasks-scrollable"
            ref={refs.scrollableRef}
          >
            <TaskList column={column} />
            {state.type === 'is-task-over' && !state.isOverChildTask ? (
              <div className="task-shadow-container">
                <TaskShadow dragging={state.dragging} />
              </div>
            ) : null}
          </div>

          <div className="add-task-section">
            {addTaskForm.isActive ? (
              <div className="add-task-form">
                <Input
                  type="text"
                  value={addTaskForm.value}
                  onChange={(e) => addTaskForm.setValue(e.target.value)}
                  onKeyDown={addTaskForm.handleKeyDown}
                  placeholder="Enter task description..."
                  autoFocus
                  error={addTaskForm.error || undefined}
                />
                <div className="add-task-actions">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={addTaskForm.submit}
                  >
                    Add Task
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={addTaskForm.cancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="medium"
                onClick={addTaskForm.start}
                icon={<span>+</span>}
                iconPosition="left"
              >
                Add a task
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}