import { useState, useCallback, useEffect } from 'react';

export interface UseModalOptions {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

export function useModal(options: UseModalOptions = {}) {
  const { closeOnEscape = true, closeOnOutsideClick = true } = options;
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, close]);

  const getModalProps = useCallback(() => ({
    'aria-hidden': !isOpen,
    role: 'dialog',
    'aria-modal': isOpen
  }), [isOpen]);

  const getBackdropProps = useCallback(() => ({
    onClick: closeOnOutsideClick ? close : undefined
  }), [closeOnOutsideClick, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    getModalProps,
    getBackdropProps
  };
}