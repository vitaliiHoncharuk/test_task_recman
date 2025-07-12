import type { TColumn } from '../../../shared/types';
import { useColumnBusinessLogic } from '../hooks/useColumnBusinessLogic';
import { useColumnDragAndDrop } from '../hooks/useColumnDragAndDrop';
import { ColumnDisplay } from './ColumnDisplay';

interface ColumnContainerProps {
  column: TColumn;
}

export function ColumnContainer({ column }: ColumnContainerProps) {
  const business = useColumnBusinessLogic(column);
  
  const dragAndDrop = useColumnDragAndDrop(column);

  return (
    <ColumnDisplay 
      business={business}
      state={dragAndDrop.state}
      refs={{
        scrollableRef: dragAndDrop.scrollableRef,
        outerFullHeightRef: dragAndDrop.outerFullHeightRef,
        headerRef: dragAndDrop.headerRef,
        innerRef: dragAndDrop.innerRef
      }}
    />
  );
}

export { ColumnContainer as Column };
export { ColumnDisplay } from './ColumnDisplay';