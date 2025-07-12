export const validateColumnTitle = (title: string): string | null => {
  if (!title.trim()) {
    return 'Column title is required';
  }
  
  if (title.length > 100) {
    return 'Column title cannot exceed 100 characters';
  }
  
  return null;
};

export const sanitizeColumnTitle = (title: string): string => {
  return title.trim().replace(/\s+/g, ' ');
};

export const validateTaskDescription = (description: string): string | null => {
  if (!description.trim()) {
    return 'Task description is required';
  }
  
  if (description.length > 500) {
    return 'Task description cannot exceed 500 characters';
  }
  
  return null;
};