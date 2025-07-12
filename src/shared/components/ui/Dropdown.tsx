import { useToggle, useClickOutside } from '../../hooks';
import './Dropdown.css';

export interface DropdownOption {
  value: string;
  label: string;
  count?: number;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValues: string[];
  onToggleOption: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
}

export function Dropdown({
  options,
  selectedValues,
  onToggleOption,
  placeholder = 'Select options...',
  className = '',
  multiple = true
}: DropdownProps) {
  const [isOpen, toggleOpen, setOpen] = useToggle(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setOpen(false), isOpen);

  const selectedCount = selectedValues.length;
  const displayText = selectedCount === 0 
    ? placeholder 
    : multiple 
      ? `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`
      : options.find(opt => opt.value === selectedValues[0])?.label || placeholder;

  return (
    <div ref={dropdownRef} className={`dropdown ${className}`}>
      <button
        type="button"
        className={`dropdown__trigger ${isOpen ? 'dropdown__trigger--open' : ''}`}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="dropdown__text">{displayText}</span>
        <span className={`dropdown__arrow ${isOpen ? 'dropdown__arrow--up' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="dropdown__menu" role="listbox" aria-multiselectable={multiple}>
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                className={`dropdown__option ${isSelected ? 'dropdown__option--selected' : ''}`}
                onClick={() => onToggleOption(option.value)}
                role="option"
                aria-selected={isSelected}
              >
                <span className="dropdown__option-text">{option.label}</span>
                {option.count !== undefined && (
                  <span className="dropdown__option-count">({option.count})</span>
                )}
                {isSelected && (
                  <span className="dropdown__checkmark" aria-hidden="true">✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}