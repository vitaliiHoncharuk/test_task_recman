import { createPortal } from 'react-dom';
import type { TTask } from '../../../shared/types';
import { useTaskBusinessLogic } from '../hooks/useTaskBusinessLogic';
import { useTaskDragAndDrop } from '../hooks/useTaskDragAndDrop';
import { TaskDisplay } from './TaskDisplay';

interface TaskContainerProps {
  task: TTask;
  columnId: string;
}

export function TaskContainer({ task, columnId }: TaskContainerProps) {
  const business = useTaskBusinessLogic(task, columnId);
  
  const dragAndDrop = useTaskDragAndDrop(task, columnId);

  return (
    <div className="task-group">
      <TaskDisplay 
        business={business}
        state={dragAndDrop.state}
        outerRef={dragAndDrop.outerRef}
        innerRef={dragAndDrop.innerRef}
      />
      {dragAndDrop.state.type === 'preview'
        ? createPortal(
            <TaskDisplay 
              business={business}
              state={dragAndDrop.state}
            />, 
            dragAndDrop.state.container
          )
        : null}
    </div>
  );
}

export { TaskContainer as Task };
export { TaskDisplay, TaskShadow } from './TaskDisplay';