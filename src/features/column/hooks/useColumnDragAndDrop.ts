import { useState, useEffect, useRef } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import invariant from 'tiny-invariant';

import {
  getColumnData,
  isTaskData,
  isTaskDropTargetData,
  isColumnData,
  isDraggingATask,
  isDraggingAColumn,
} from '../../../shared/types';
import type { TTaskData, TColumn } from '../../../shared/types';
import { isSafari } from '../../../shared/utils';
import { isShallowEqual } from '../../../shared/utils';
import type { ColumnState } from '../types';

const idle: ColumnState = { type: 'idle' };

export function useColumnDragAndDrop(column: TColumn) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<ColumnState>(idle);

  useEffect(() => {
    const outer = outerFullHeightRef.current;
    const scrollable = scrollableRef.current;
    const header = headerRef.current;
    const inner = innerRef.current;
    invariant(outer);
    invariant(scrollable);
    invariant(header);
    invariant(inner);

    const data = getColumnData({ column });

    function setIsTaskOver({ data, location }: { data: TTaskData; location: DragLocationHistory }) {
      const innerMost = location.current.dropTargets[0];
      const isOverChildTask = Boolean(innerMost && isTaskDropTargetData(innerMost.data));

      const proposed: ColumnState = {
        type: 'is-task-over',
        dragging: data.rect,
        isOverChildTask,
      };
      
      setState((current) => {
        if (isShallowEqual(proposed, current)) {
          return current;
        }
        return proposed;
      });
    }

    return combine(
      draggable({
        element: header,
        getInitialData: () => data,
        onGenerateDragPreview({ source, location, nativeSetDragImage }) {
          const data = source.data;
          invariant(isColumnData(data));
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({ element: header, input: location.current.input }),
            render({ container }) {
              const rect = inner.getBoundingClientRect();
              const preview = inner.cloneNode(true);
              invariant(preview instanceof HTMLElement);
              preview.style.width = `${rect.width}px`;
              preview.style.height = `${rect.height}px`;

              if (!isSafari()) {
                preview.style.transform = 'rotate(4deg)';
              }

              container.appendChild(preview);
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
        getData: () => data,
        canDrop({ source }) {
          return isDraggingATask({ source }) || isDraggingAColumn({ source });
        },
        getIsSticky: () => true,
        onDragStart({ source, location }) {
          if (isTaskData(source.data)) {
            setIsTaskOver({ data: source.data, location });
          }
        },
        onDragEnter({ source, location }) {
          if (isTaskData(source.data)) {
            setIsTaskOver({ data: source.data, location });
            return;
          }
          if (isColumnData(source.data) && source.data.column.id !== column.id) {
            setState({ type: 'is-column-over' });
          }
        },
        onDropTargetChange({ source, location }) {
          if (isTaskData(source.data)) {
            setIsTaskOver({ data: source.data, location });
            return;
          }
        },
        onDragLeave({ source }) {
          if (isColumnData(source.data) && source.data.column.id === column.id) {
            return;
          }
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          return isDraggingATask({ source });
        },
        element: scrollable,
      }),
    );
  }, [column]);

  return {
    scrollableRef,
    outerFullHeightRef,
    headerRef,
    innerRef,
    state
  };
}