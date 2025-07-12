export const validateTaskDescription = (description: string): string | null => {
  if (!description.trim()) {
    return 'Task description cannot be empty';
  }
  
  if (description.length > 500) {
    return 'Task description cannot exceed 500 characters';
  }
  
  return null;
};

export const sanitizeTaskDescription = (description: string): string => {
  return description.trim().replace(/\s+/g, ' ');
};