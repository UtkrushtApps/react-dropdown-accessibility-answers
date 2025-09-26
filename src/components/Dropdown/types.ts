// types.ts
export type Option = {
  label: string;
  value: string | number;
};

export type DropdownProps = {
  options: Option[];
  value?: Option | Option[]; // controlled
  defaultValue?: Option | Option[]; // uncontrolled
  onChange?: (selected: Option | Option[]) => void;
  multiple?: boolean;
  placement?: 'auto' | 'top' | 'bottom';
  disabled?: boolean;
  placeholder?: string;
  menuMaxHeight?: number;
  menuWidth?: number;
  id?: string;
  className?: string;
};

export type SelectionType = Option | Option[] | null;
