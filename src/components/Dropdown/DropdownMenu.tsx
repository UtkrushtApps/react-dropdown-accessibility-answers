// DropdownMenu.tsx
import React, { forwardRef } from 'react';
import { Option, SelectionType } from './types';

interface DropdownMenuProps {
  options: Option[];
  highlightedIdx: number;
  setHighlightedIdx: (idx: number) => void;
  selected: SelectionType;
  multiple: boolean;
  onOptionSelect: (option: Option) => void;
  menuStyles: React.CSSProperties;
  ariaLabelledBy: string;
  listboxId: string;
  maxHeight?: number;
  menuPlacement?: 'top' | 'bottom';
}

const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(
  (
    {
      options,
      highlightedIdx,
      setHighlightedIdx,
      selected,
      multiple,
      onOptionSelect,
      menuStyles,
      ariaLabelledBy,
      listboxId,
      maxHeight = 220,
      menuPlacement
    },
    ref
  ) => {
    // For accessibility: mouse over highlights, click selects
    return (
      <ul
        ref={ref}
        className={`acme-dropdown-menu${menuPlacement === 'top' ? ' acme-dropdown-menu-top' : ''}`}
        style={{
          ...menuStyles,
          maxHeight: maxHeight,
          overflowY: 'auto',
          outline: 'none',
        }}
        role="listbox"
        tabIndex={-1}
        aria-labelledby={ariaLabelledBy}
        id={listboxId}
      >
        {options.map((option, idx) => {
          const isSelected = multiple
            ? Array.isArray(selected) && selected.some(sel => sel.value === option.value)
            : selected && 'value' in selected && selected.value === option.value;
          const isHighlighted = idx === highlightedIdx;
          return (
            <li
              key={option.value}
              className={`acme-dropdown-option${isHighlighted ? ' highlighted' : ''}${isSelected ? ' selected' : ''}`}
              role="option"
              aria-selected={!!isSelected}
              tabIndex={-1}
              onMouseEnter={() => setHighlightedIdx(idx)}
              onMouseDown={e => {
                e.preventDefault();
                onOptionSelect(option);
              }}
              id={`${listboxId}-option-${idx}`}
            >
              {option.label}
              {isSelected && (
                <span className="acme-dropdown-checkmark" aria-hidden>
                  ✓
                </span>
              )}
            </li>
          );
        })}
        {options.length === 0 && (
          <li className="acme-dropdown-no-options" role="option" aria-disabled>
            No options
          </li>
        )}
      </ul>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
