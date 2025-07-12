import { useEffect, useRef, useState } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import {
  isTaskData,
  isTaskDropTargetData,
  isColumnData,
  isDraggingATask,
  isDraggingAColumn,
} from '../../../shared/types';
import type { TColumn, TBoard } from '../../../shared/types';
import { blockBoardPanningAttr } from '../../../shared/utils';

type TodoAction = 
  | { type: 'SET_BOARD'; payload: TBoard }
  | { type: 'REORDER_COLUMNS'; payload: { columns: TColumn[] } };

export function useBoardDragAndDrop(board: TBoard, dispatch: React.Dispatch<TodoAction>) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);
    
    return combine(
      monitorForElements({
        canMonitor: isDraggingATask,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isTaskData(dragging)) {
            return;
          }

          const innerMost = location.current.dropTargets[0];
          if (!innerMost) {
            return;
          }

          const dropTargetData = innerMost.data;
          const homeColumnIndex = board.columns.findIndex(
            (column) => column.id === dragging.columnId,
          );
          const home: TColumn | undefined = board.columns[homeColumnIndex];

          if (!home) {
            return;
          }
          
          const taskIndexInHome = home.tasks.findIndex((task) => task.id === dragging.task.id);

          if (isTaskDropTargetData(dropTargetData)) {
            const destinationColumnIndex = board.columns.findIndex(
              (column) => column.id === dropTargetData.columnId,
            );
            const destination = board.columns[destinationColumnIndex];
            
            if (home === destination) {
              const taskFinishIndex = home.tasks.findIndex(
                (task) => task.id === dropTargetData.task.id,
              );

              if (taskIndexInHome === -1 || taskFinishIndex === -1) {
                return;
              }

              if (taskIndexInHome === taskFinishIndex) {
                return;
              }

              const closestEdge = extractClosestEdge(dropTargetData);
              const reordered = reorderWithEdge({
                axis: 'vertical',
                list: home.tasks,
                startIndex: taskIndexInHome,
                indexOfTarget: taskFinishIndex,
                closestEdgeOfTarget: closestEdge,
              });

              const updated: TColumn = {
                ...home,
                tasks: reordered,
              };
              const columns = Array.from(board.columns);
              columns[homeColumnIndex] = updated;
              dispatch({ type: 'SET_BOARD', payload: { ...board, columns } });
              return;
            }

            if (!destination) {
              return;
            }

            const indexOfTarget = destination.tasks.findIndex(
              (task) => task.id === dropTargetData.task.id,
            );

            const closestEdge = extractClosestEdge(dropTargetData);
            const finalIndex = closestEdge === 'bottom' ? indexOfTarget + 1 : indexOfTarget;

            const homeTasks = Array.from(home.tasks);
            homeTasks.splice(taskIndexInHome, 1);

            const destinationTasks = Array.from(destination.tasks);
            destinationTasks.splice(finalIndex, 0, { ...dragging.task, selected: false });

            const columns = Array.from(board.columns);
            columns[homeColumnIndex] = {
              ...home,
              tasks: homeTasks,
            };
            columns[destinationColumnIndex] = {
              ...destination,
              tasks: destinationTasks,
            };
            dispatch({ type: 'SET_BOARD', payload: { ...board, columns } });
            return;
          }

          if (isColumnData(dropTargetData)) {
            const destinationColumnIndex = board.columns.findIndex(
              (column) => column.id === dropTargetData.column.id,
            );
            const destination = board.columns[destinationColumnIndex];

            if (!destination) {
              return;
            }

            if (home === destination) {
              const reordered = reorder({
                list: home.tasks,
                startIndex: taskIndexInHome,
                finishIndex: home.tasks.length - 1,
              });

              const updated: TColumn = {
                ...home,
                tasks: reordered,
              };
              const columns = Array.from(board.columns);
              columns[homeColumnIndex] = updated;
              dispatch({ type: 'SET_BOARD', payload: { ...board, columns } });
              return;
            }

            const homeTasks = Array.from(home.tasks);
            homeTasks.splice(taskIndexInHome, 1);

            const destinationTasks = Array.from(destination.tasks);
            destinationTasks.splice(destination.tasks.length, 0, { ...dragging.task, selected: false });

            const columns = Array.from(board.columns);
            columns[homeColumnIndex] = {
              ...home,
              tasks: homeTasks,
            };
            columns[destinationColumnIndex] = {
              ...destination,
              tasks: destinationTasks,
            };
            dispatch({ type: 'SET_BOARD', payload: { ...board, columns } });
            return;
          }
        },
      }),
      monitorForElements({
        canMonitor: isDraggingAColumn,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isColumnData(dragging)) {
            return;
          }

          const innerMost = location.current.dropTargets[0];
          if (!innerMost) {
            return;
          }

          const dropTargetData = innerMost.data;
          if (!isColumnData(dropTargetData)) {
            return;
          }

          const homeIndex = board.columns.findIndex((column) => column.id === dragging.column.id);
          const destinationIndex = board.columns.findIndex(
            (column) => column.id === dropTargetData.column.id,
          );

          if (homeIndex === -1 || destinationIndex === -1) {
            return;
          }

          if (homeIndex === destinationIndex) {
            return;
          }

          const reordered = reorder({
            list: board.columns,
            startIndex: homeIndex,
            finishIndex: destinationIndex,
          });
          
          dispatch({ type: 'REORDER_COLUMNS', payload: { columns: reordered } });
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          return isDraggingATask({ source }) || isDraggingAColumn({ source });
        },
        element,
      }),
    );
  }, [board, dispatch]);

  useEffect(() => {
    const scrollable = scrollableRef.current;
    invariant(scrollable);

    function begin({ startX }: { startX: number }) {
      let lastX = startX;

      const cleanupEvents = bindAll(
        window,
        [
          {
            type: 'pointermove',
            listener(event) {
              const currentX = event.clientX;
              const diffX = lastX - currentX;

              lastX = currentX;
              scrollable?.scrollBy({ left: diffX });
            },
          },
          ...(
            [
              'pointercancel',
              'pointerup',
              'pointerdown',
              'keydown',
              'resize',
              'click',
              'visibilitychange',
            ] as const
          ).map((eventName) => ({ type: eventName, listener: () => cleanupEvents() })),
        ],
        { capture: true },
      );

      return cleanupEvents;
    }

    const cleanupStart = bindAll(scrollable, [
      {
        type: 'pointerdown',
        listener(event) {
          if (!(event.target instanceof HTMLElement)) {
            return;
          }
          if (event.target.closest(`[${blockBoardPanningAttr}]`)) {
            return;
          }
          begin({ startX: event.clientX });
        },
      },
    ]);

    return cleanupStart;
  }, []);

  useEffect(() => {
    const checkScrollable = () => {
      const element = scrollableRef.current;
      if (element) {
        const hasOverflow = element.scrollWidth > element.clientWidth;
        setShowScrollHint(hasOverflow && board.columns.length > 2);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [board.columns.length]);

  return {
    scrollableRef,
    showScrollHint
  };
}