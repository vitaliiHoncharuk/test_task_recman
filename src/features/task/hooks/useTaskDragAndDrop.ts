import { useState, useEffect, useRef } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import invariant from 'tiny-invariant';

import { getTaskData, getTaskDropTargetData, isTaskData, isDraggingATask } from '../../../shared/types';
import type { TTask } from '../../../shared/types';
import { isShallowEqual } from '../../../shared/utils';

type TTaskState =
  | { type: 'idle' }
  | { type: 'is-dragging' }
  | { type: 'is-dragging-and-left-self' }
  | { type: 'is-over'; dragging: DOMRect; closestEdge: 'top' | 'bottom' }
  | { type: 'preview'; container: HTMLElement; dragging: DOMRect };

const idle: TTaskState = { type: 'idle' };

export function useTaskDragAndDrop(task: TTask, columnId: string) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TTaskState>(idle);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    invariant(outer && inner);

    return combine(
      draggable({
        element: inner,
        getInitialData: ({ element }) =>
          getTaskData({ task, columnId, rect: element.getBoundingClientRect() }),
        onGenerateDragPreview({ nativeSetDragImage, location, source }) {
          const data = source.data;
          invariant(isTaskData(data));
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({ element: inner, input: location.current.input }),
            render({ container }) {
              setState({
                type: 'preview',
                container,
                dragging: inner.getBoundingClientRect(),
              });
            },
          });
        },
        onDragStart() {
          setState({ type: 'is-dragging' });
        },
        onDrop() {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element: outer,
        getIsSticky: () => true,
        canDrop: isDraggingATask,
        getData: ({ element, input }) => {
          const data = getTaskDropTargetData({ task, columnId });
          return attachClosestEdge(data, { element, input, allowedEdges: ['top', 'bottom'] });
        },
        onDragEnter({ source, self }) {
          if (!isTaskData(source.data)) return;
          if (source.data.task.id === task.id) return;
          
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge || (closestEdge !== 'top' && closestEdge !== 'bottom')) return;

          setState({ type: 'is-over', dragging: source.data.rect, closestEdge });
        },
        onDrag({ source, self }) {
          if (!isTaskData(source.data)) return;
          if (source.data.task.id === task.id) return;
          
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge || (closestEdge !== 'top' && closestEdge !== 'bottom')) return;
          
          const proposed: TTaskState = { type: 'is-over', dragging: source.data.rect, closestEdge };
          setState((current) => {
            if (isShallowEqual(proposed, current)) {
              return current;
            }
            return proposed;
          });
        },
        onDragLeave({ source }) {
          if (!isTaskData(source.data)) return;
          
          if (source.data.task.id === task.id) {
            setState({ type: 'is-dragging-and-left-self' });
            return;
          }
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      }),
    );
  }, [task, columnId]);

  return {
    outerRef,
    innerRef,
    state,
    isDragging: state.type === 'is-dragging' || state.type === 'is-dragging-and-left-self',
    isPreview: state.type === 'preview'
  };
}