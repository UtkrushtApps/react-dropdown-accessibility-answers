// useDropdownPosition.ts
import { useLayoutEffect, useState } from 'react';

type Placement = 'top' | 'bottom' | 'auto';

interface UseDropdownPositionProps {
  triggerRef: React.RefObject<HTMLElement>;
  menuOpen: boolean;
  placement: Placement;
  menuMaxHeight?: number;
  menuMinWidth?: number;
}

export function useDropdownPosition({
  triggerRef,
  menuOpen,
  placement,
  menuMaxHeight = 220,
  menuMinWidth
}: UseDropdownPositionProps) {
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});
  const [menuPlacement, setMenuPlacement] = useState<'top' | 'bottom'>('bottom');

  useLayoutEffect(() => {
    if (!menuOpen || !triggerRef.current) return;
    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    const shouldOpenTop = placement === 'top' || (placement === 'auto' && spaceBelow < menuMaxHeight && spaceAbove > spaceBelow);

    setMenuPlacement(shouldOpenTop ? 'top' : 'bottom');

    const styles: React.CSSProperties = {
      position: 'absolute',
      left: 0,
      minWidth: menuMinWidth || rect.width,
      zIndex: 1000,
      ...(shouldOpenTop
        ? {
            bottom: `calc(100% + 4px)`
          }
        : {
            top: `calc(100% + 4px)`
          }
      ),
    };
    setMenuStyles(styles);
  }, [menuOpen, triggerRef, placement, menuMaxHeight, menuMinWidth]);

  return {
    menuStyles,
    menuPlacement
  };
}
