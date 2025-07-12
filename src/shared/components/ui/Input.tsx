import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onClear,
  showClearButton = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 11)}`;
  const hasError = !!error;
  const hasClearButton = showClearButton && props.value && onClear;

  const inputClass = [
    'input',
    hasError ? 'input--error' : '',
    leftIcon ? 'input--with-left-icon' : '',
    (rightIcon || hasClearButton) ? 'input--with-right-icon' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
        </label>
      )}
      <div className="input__container">
        {leftIcon && (
          <span className="input__icon input__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClass}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : 
            undefined
          }
          {...props}
        />
        {hasClearButton && (
          <button
            type="button"
            className="input__clear-btn"
            onClick={onClear}
            aria-label="Clear input"
          >
            ×
          </button>
        )}
        {rightIcon && !hasClearButton && (
          <span className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="input__error" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${inputId}-helper`} className="input__helper">
          {helperText}
        </span>
      )}
    </div>
  );
});