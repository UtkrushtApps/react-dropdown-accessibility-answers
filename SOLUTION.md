# Solution Steps

1. Define types in 'src/components/Dropdown/types.ts' to model Options, Props, and Selection types for the Dropdown.

2. Implement 'useDropdownPosition' in 'src/components/Dropdown/useDropdownPosition.ts' to measure available space and set absolute positioning below or above trigger based on menu placement logic.

3. Implement 'useOnClickOutside' in 'src/components/Dropdown/useOnClickOutside.ts' to detect and handle clicks/touches outside the dropdown component for closing the menu.

4. Create 'DropdownToggle' in 'src/components/Dropdown/DropdownToggle.tsx', rendering a button with the current selection, arrow, a11y props, and ref passthrough.

5. Create 'DropdownMenu' in 'src/components/Dropdown/DropdownMenu.tsx'. Render a listbox ul/li with correct ARIA, highlighting, selection checkmarks, keyboard focus, and no-options state.

6. Implement the main 'Dropdown' in 'src/components/Dropdown/Dropdown.tsx':

7.   - Support both controlled and uncontrolled selection state (single and multi).

8.   - Mount/unmount and focus the menu, close on escape/click-outside, and apply ARIA props.

9.   - Support arrow/enter/escape/key navigation and selection callbacks.

10.   - Call useDropdownPosition for menu placement and useOnClickOutside for closability.

11.   - Pass all highlight/index/selection details and selection/interaction handlers down to children.

12. Export Dropdown as the reusable, accessible, and composable component.

