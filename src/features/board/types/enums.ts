export const CompletionFilter = {
  ALL: 'all',
  COMPLETED: 'completed',
  UNCOMPLETED: 'uncompleted'
} as const;

export type CompletionFilter = typeof CompletionFilter[keyof typeof CompletionFilter];