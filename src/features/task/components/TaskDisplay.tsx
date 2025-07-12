import type { RefObject } from 'react';

import { Button, Input } from '../../../shared/components';
import { isSafari } from '../../../shared/utils';
import type { TaskBusinessLogic } from '../types';
import '../components/Task.css';

type TTaskState =
  | { type: 'idle' }
  | { type: 'is-dragging' }
  | { type: 'is-dragging-and-left-self' }
  | { type: 'is-over'; dragging: DOMRect; closestEdge: 'top' | 'bottom' }
  | { type: 'preview'; container: HTMLElement; dragging: DOMRect };

export function TaskShadow({ dragging }: { dragging: DOMRect }) {
  return (
    <div 
      className="task-shadow" 
      style={{ height: dragging.height }} 
    />
  );
}

interface TaskDisplayProps {
  business: TaskBusinessLogic;
  state: TTaskState;
  outerRef?: RefObject<HTMLDivElement | null>;
  innerRef?: RefObject<HTMLDivElement | null>;
}

export function TaskDisplay({
  business,
  state,
  outerRef,
  innerRef,
}: TaskDisplayProps) {
  const { task, isSelected, isCompleted, handlers, editState } = business;

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlers.onToggleComplete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlers.onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlers.onDelete();
  };

  const handleToggleSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlers.onToggleSelection();
  };

  const stateClasses: { [Key in TTaskState['type']]?: string } = {
    idle: 'idle',
    'is-dragging': 'is-dragging',
    'is-dragging-and-left-self': 'hidden',
  };

  return (
    <div
      ref={outerRef}
      className={`task-container ${state.type === 'is-dragging-and-left-self' ? 'hidden' : ''}`}
    >
      {state.type === 'is-over' && state.closestEdge === 'top' ? (
        <TaskShadow dragging={state.dragging} />
      ) : null}
      
      <div
        className={`
          task-card
          ${isCompleted ? 'completed' : ''}
          ${isSelected ? 'selected' : ''}
          ${stateClasses[state.type] || ''}
        `}
        ref={innerRef}
        style={
          state.type === 'preview'
            ? {
                width: state.dragging.width,
                height: state.dragging.height,
                transform: isSafari() ? undefined : 'rotate(4deg)',
              }
            : undefined
        }
      >
        <div className="task-content">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            onClick={handleToggleSelection}
            className="task-checkbox"
          />

          <div className="task-text-container">
            {editState.isEditing ? (
              <Input
                type="text"
                value={editState.currentValue}
                onChange={() => {}}
                onBlur={() => handlers.onSaveEdit(editState.currentValue)}
                autoFocus
              />
            ) : (
              <div
                className="task-text"
                onClick={handleEdit}
                title="Click to edit"
              >
                {task.description}
              </div>
            )}
          </div>

          <Button
            variant={isCompleted ? 'success' : 'ghost'}
            size="small"
            onClick={handleToggleComplete}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            icon={
              isCompleted ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              )
            }
          />

          {!editState.isEditing && (
            <div className="task-actions">
              <Button
                variant="ghost"
                size="small"
                onClick={handleEdit}
                title="Edit task"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                }
              />
              <Button
                variant="ghost"
                size="small"
                onClick={handleDelete}
                title="Delete task"
                className="task-delete-btn"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18m-2 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                }
              />
            </div>
          )}
        </div>
      </div>

      {state.type === 'is-over' && state.closestEdge === 'bottom' ? (
        <TaskShadow dragging={state.dragging} />
      ) : null}
    </div>
  );
}