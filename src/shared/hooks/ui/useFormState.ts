import {useState, useCallback, useMemo} from 'react';

export interface UseFormStateOptions {
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  validateFn?: (value: string) => string | null;
}

export function useFormState(
  initialValue: string = '',
  options: UseFormStateOptions = {}
) {
  const { onSubmit, onCancel, validateFn } = options;
  const [value, setValue] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(() => {
    setIsActive(true);
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const cancel = useCallback(() => {
    setIsActive(false);
    setValue(initialValue);
    setError(null);
    onCancel?.();
  }, [initialValue, onCancel]);

  const submit = useCallback(() => {
    const trimmedValue = value.trim();
    
    if (validateFn) {
      const validationError = validateFn(trimmedValue);
      if (validationError) {
        setError(validationError);
        return false;
      }
    }

    if (!trimmedValue) {
      setError('This field is required');
      return false;
    }

    onSubmit?.(trimmedValue);
    setIsActive(false);
    setValue(initialValue);
    setError(null);
    return true;
  }, [value, validateFn, onSubmit, initialValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  }, [submit, cancel]);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    if (error) setError(null);
  }, [error]);

  return useMemo(() => ({
    value,
    setValue: handleChange,
    isActive,
    error,
    start,
    cancel,
    submit,
    handleKeyDown
  }), [value, handleChange, isActive, error, start, cancel, submit, handleKeyDown]);
}