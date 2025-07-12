export const validateColumnTitle = (title: string, existingTitles: string[]): string | null => {
  if (!title.trim()) {
    return 'Column title is required';
  }
  
  if (title.length > 100) {
    return 'Column title cannot exceed 100 characters';
  }
  
  if (existingTitles.includes(title.trim())) {
    return 'Column with this title already exists';
  }
  
  return null;
};

export const sanitizeColumnTitle = (title: string): string => {
  return title.trim().replace(/\s+/g, ' ');
};