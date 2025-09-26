// DropdownToggle.tsx
import React, { forwardRef } from 'react';

type DropdownToggleProps = React.ComponentPropsWithoutRef<'button'> & {
  selectedLabel: string;
};

const DropdownToggle = forwardRef<HTMLButtonElement, DropdownToggleProps>(({ selectedLabel, ...props }, ref) => (
  <button
    type="button"
    className="acme-dropdown-trigger"
    ref={ref}
    {...props}
  >
    <span className="acme-dropdown-value">{selectedLabel}</span>
    <span className="acme-dropdown-caret" aria-hidden>▼</span>
  </button>
));

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
