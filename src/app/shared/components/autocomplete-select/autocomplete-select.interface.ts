export interface AutocompleteOption {
  id: string | number;
  text: string;
  icon?: string;
  disabled?: boolean;
  metadata?: any;
}

export interface AutocompleteConfig {
  placeholder?: string;
  label?: string;
  appearance?: 'fill' | 'outline' | 'legacy' | 'standard';
  prefixIcon?: string;
  suffixIcon?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  useChips?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  emptyMessage?: string;
  maxHeight?: string;
  width?: string;
  customClasses?: string;
}

export type AutocompleteSelectionType = 'single' | 'multiple' | 'chips';

export interface AutocompleteSelectionEvent {
  option: AutocompleteOption;
  allSelected: AutocompleteOption[];
}

export interface AutocompleteRemoveEvent {
  option: AutocompleteOption;
  remaining: AutocompleteOption[];
}