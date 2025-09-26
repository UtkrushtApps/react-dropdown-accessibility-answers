// Dropdown.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import { useDropdownPosition } from './useDropdownPosition';
import { Option, DropdownProps, SelectionType } from './types';
import { useOnClickOutside } from './useOnClickOutside';

function isOptionSelected(selected: SelectionType, option: Option, multiple: boolean) {
  if (multiple) {
    return Array.isArray(selected) && selected.some(sel => sel.value === option.value);
  } else {
    return selected && 'value' in selected && selected.value === option.value;
  }
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  multiple = false,
  value,
  defaultValue,
  onChange,
  placement = 'auto',
  disabled = false,
  placeholder = 'Select...',
  menuMaxHeight = 220,
  menuWidth,
  id,
  className,
  ...rest
}) => {
  // Controlled/uncontrolled selection state
  const isControlled = typeof value !== 'undefined';
  const [internalValue, setInternalValue] = useState<SelectionType>(() => 
    multiple ? (defaultValue ?? []) : (defaultValue ?? null)
  );
  const selected = isControlled ? value : internalValue;
  
  // Menu control
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(-1);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intelligent positioning
  const { menuStyles, menuPlacement } = useDropdownPosition({
    triggerRef,
    menuOpen,
    placement,
    menuMaxHeight,
    menuMinWidth: menuWidth
  });

  // Close on click outside
  useOnClickOutside(containerRef, () => {
    setMenuOpen(false);
    setHighlightedIdx(-1);
  });

  // Keyboard navigation
  const openMenu = useCallback(() => {
    if (!disabled) {
      setMenuOpen(true);
      setTimeout(() => setHighlightedIdx(0), 0);
    }
  }, [disabled]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setHighlightedIdx(-1);
  }, []);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!menuOpen) {
          openMenu();
        } else {
          setHighlightedIdx(idx => {
            const max = options.length - 1;
            let next = idx;
            if (e.key === 'ArrowDown') next = idx < max ? idx + 1 : 0;
            else next = idx > 0 ? idx - 1 : max;
            return next;
          });
        }
        break;
      case 'Enter':
      case ' ': // space
        e.preventDefault();
        if (!menuOpen) {
          openMenu();
        } else if (highlightedIdx !== -1) {
          handleOptionSelect(options[highlightedIdx]);
        }
        break;
      case 'Escape':
        closeMenu();
        break;
      default:
        break;
    }
  };

  // Move focus to menu when opened
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      menuRef.current.focus();
    }
  }, [menuOpen]);

  // Option selection logic
  const handleOptionSelect = useCallback((option: Option) => {
    if (multiple) {
      let newValue: Option[];
      if (!Array.isArray(selected)) newValue = [option];
      else if (selected.some(sel => sel.value === option.value)) {
        newValue = selected.filter(sel => sel.value !== option.value);
      } else {
        newValue = [...selected, option];
      }
      if (!isControlled) setInternalValue(newValue);
      onChange && onChange(newValue);
    } else {
      if (!selected || selected.value !== option.value) {
        if (!isControlled) setInternalValue(option);
        onChange && onChange(option);
      }
      closeMenu();
    }
  }, [isControlled, multiple, onChange, selected, closeMenu]);

  // Focus management for accessibility
  useEffect(() => {
    if (!menuOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [menuOpen]);

  const getSelectedLabel = () => {
    if (multiple) {
      if (Array.isArray(selected) && selected.length > 0) {
        return selected.map(o => o.label).join(', ');
      }
    } else if (selected) {
      return (selected as Option).label;
    }
    return placeholder;
  };

  // ARIA ids
  const baseId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;

  return (
    <div
      className={`acme-dropdown-container${className ? ` ${className}` : ''}`}
      ref={containerRef}
      {...rest}
    >
      <DropdownToggle
        ref={triggerRef}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? listboxId : undefined}
        id={labelId}
        onClick={() => (menuOpen ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        selectedLabel={getSelectedLabel()}
      />

      {menuOpen && (
        <DropdownMenu
          ref={menuRef}
          options={options}
          multiple={multiple}
          highlightedIdx={highlightedIdx}
          setHighlightedIdx={setHighlightedIdx}
          selected={selected}
          onOptionSelect={handleOptionSelect}
          menuStyles={menuStyles}
          ariaLabelledBy={labelId}
          listboxId={listboxId}
          maxHeight={menuMaxHeight}
          menuPlacement={menuPlacement}
        />
      )}
    </div>
  );
};

export default Dropdown;
