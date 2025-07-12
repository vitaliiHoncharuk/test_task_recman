export type TTask = {
  id: string;
  description: string;
  completed: boolean;
  selected?: boolean;
};

export type TColumn = {
  id: string;
  title: string;
  tasks: TTask[];
};

export type TBoard = {
  columns: TColumn[];
};

const taskKey = Symbol('task');
export type TTaskData = {
  [taskKey]: true;
  task: TTask;
  columnId: string;
  rect: DOMRect;
};

export function getTaskData({
  task,
  rect,
  columnId,
}: Omit<TTaskData, typeof taskKey> & { columnId: string }): TTaskData {
  return {
    [taskKey]: true,
    rect,
    task,
    columnId,
  };
}

export function isTaskData(value: Record<string | symbol, unknown>): value is TTaskData {
  return Boolean(value[taskKey]);
}

export function isDraggingATask({
  source,
}: {
  source: { data: Record<string | symbol, unknown> };
}): boolean {
  return isTaskData(source.data);
}

const taskDropTargetKey = Symbol('task-drop-target');
export type TTaskDropTargetData = {
  [taskDropTargetKey]: true;
  task: TTask;
  columnId: string;
};

export function isTaskDropTargetData(
  value: Record<string | symbol, unknown>,
): value is TTaskDropTargetData {
  return Boolean(value[taskDropTargetKey]);
}

export function getTaskDropTargetData({
  task,
  columnId,
}: Omit<TTaskDropTargetData, typeof taskDropTargetKey> & {
  columnId: string;
}): TTaskDropTargetData {
  return {
    [taskDropTargetKey]: true,
    task,
    columnId,
  };
}

const columnKey = Symbol('column');
export type TColumnData = {
  [columnKey]: true;
  column: TColumn;
};

export function getColumnData({ column }: Omit<TColumnData, typeof columnKey>): TColumnData {
  return {
    [columnKey]: true,
    column,
  };
}

export function isColumnData(value: Record<string | symbol, unknown>): value is TColumnData {
  return Boolean(value[columnKey]);
}

export function isDraggingAColumn({
  source,
}: {
  source: { data: Record<string | symbol, unknown> };
}): boolean {
  return isColumnData(source.data);
}