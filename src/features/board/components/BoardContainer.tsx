import { useBoardBusinessLogic } from '../hooks/useBoardBusinessLogic';
import { useBoardDragAndDrop } from '../hooks/useBoardDragAndDrop';
import { BoardDisplay } from './BoardDisplay';
import { useTodoContext } from '../../../app/TodoContext';

export function BoardContainer() {
  const { board, dispatch } = useTodoContext();
  
  const business = useBoardBusinessLogic();
  
  const dragAndDrop = useBoardDragAndDrop(board, dispatch);

  return (
    <BoardDisplay 
      business={business}
      scrollableRef={dragAndDrop.scrollableRef}
      showScrollHint={dragAndDrop.showScrollHint}
    />
  );
}

export { BoardContainer as Board };
export { BoardDisplay } from './BoardDisplay';