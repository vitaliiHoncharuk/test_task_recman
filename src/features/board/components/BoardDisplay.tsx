import { Column } from '../../column';
import { Dropdown, Input, Button } from '../../../shared/components';
import type { BoardBusinessLogic } from '../types';
import { CompletionFilter } from '../types';
import { applyBoardFilters } from '../utils/boardFilters';
import './Board.css';

interface BoardDisplayProps {
  business: BoardBusinessLogic;
  scrollableRef: React.RefObject<HTMLDivElement | null>;
  showScrollHint: boolean;
}

export function BoardDisplay({ business, scrollableRef, showScrollHint }: BoardDisplayProps) {
  const { 
    board, 
    searchState, 
    columnFilterState, 
    completionFilterState,
    addColumnState, 
    handlers 
  } = business;

  const filteredData = applyBoardFilters(
    board,
    searchState.query,
    columnFilterState.selectedColumns,
    searchState.filteredTasks,
    completionFilterState.completionFilter
  );

  const hasFilters = searchState.hasQuery || columnFilterState.selectedColumns.length > 0 || completionFilterState.completionFilter !== CompletionFilter.ALL;

  return (
    <div className="board-layout">
      <div className="board-header">
        <h1 className="board-title">Todo Board</h1>
        
        <div className="search-filter-container">
          <div className="search-input-wrapper">
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchState.query}
              onChange={(e) => searchState.setQuery(e.target.value)}
              showClearButton={searchState.hasQuery}
              onClear={searchState.clearSearch}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              }
            />
          </div>

          <Dropdown
            options={columnFilterState.columnOptions}
            selectedValues={columnFilterState.selectedColumns}
            onToggleOption={columnFilterState.toggleColumnSelection}
            placeholder="Filter by columns..."
            className="column-filter-dropdown"
          />

          <Dropdown
            options={completionFilterState.completionOptions}
            selectedValues={[completionFilterState.completionFilter]}
            onToggleOption={(value) => completionFilterState.setCompletionFilter(value as CompletionFilter)}
            placeholder="Filter by completion..."
            className="completion-filter-dropdown"
            multiple={false}
          />

          {hasFilters && (
            <Button
              variant="ghost"
              size="small"
              onClick={handlers.onClearAllFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {hasFilters && (
          <div className="filter-status">
            {searchState.hasQuery && (
              <span>Search: "{searchState.query}" • </span>
            )}
            {columnFilterState.selectedColumns.length > 0 && (
              <span>Columns: {columnFilterState.selectedColumns.length} selected • </span>
            )}
            {completionFilterState.completionFilter !== CompletionFilter.ALL && (
              <span>Status: {completionFilterState.completionFilter} • </span>
            )}
            <span>
              Showing {filteredData.totalTasks} tasks
            </span>
          </div>
        )}
      </div>

      <div className="board-content">
        <div
          className="columns-container"
          ref={scrollableRef}
        >
          {showScrollHint && (
            <div className="scroll-hint">
              ← Scroll horizontally →
            </div>
          )}
          {filteredData.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}

          <div className="add-column-container">
            {addColumnState.isActive ? (
              <div className="add-column-form">
                <Input
                  type="text"
                  value={addColumnState.value}
                  onChange={(e) => addColumnState.setValue(e.target.value)}
                  onKeyDown={addColumnState.handleKeyDown}
                  placeholder="Enter column title..."
                  autoFocus
                  error={addColumnState.error || undefined}
                />
                <div className="add-column-actions">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={addColumnState.submit}
                  >
                    Add Column
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={addColumnState.cancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="medium"
                onClick={addColumnState.start}
                icon={<span>+</span>}
                iconPosition="left"
              >
                Add Column
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}