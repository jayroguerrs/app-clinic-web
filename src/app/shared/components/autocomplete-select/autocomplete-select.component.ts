import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnDestroy, 
  OnChanges,
  SimpleChanges,
  forwardRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef 
} from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  FormControl, 
  AbstractControl 
} from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { 
  AutocompleteOption, 
  AutocompleteConfig, 
  AutocompleteSelectionEvent, 
  AutocompleteRemoveEvent 
} from './autocomplete-select.interface';

@Component({
  selector: 'app-autocomplete-select',
  templateUrl: './autocomplete-select.component.html',
  styleUrls: ['./autocomplete-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteSelectComponent),
      multi: true
    }
  ]
})
export class AutocompleteSelectComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {

  @Input() options: AutocompleteOption[] = [];
  @Input() config: AutocompleteConfig = {};
  @Input() control: AbstractControl | null = null;

  @Input() promociones: any[] = [];
  @Input() promocionSeleccionadaId: number | null = null;
  
  @Output() selectionChange = new EventEmitter<AutocompleteSelectionEvent>();
  @Output() optionRemoved = new EventEmitter<AutocompleteRemoveEvent>();
  @Output() cleared = new EventEmitter<void>();

  // Controles internos
  searchControl = new FormControl('');
  selectedOptions: AutocompleteOption[] = [];
  
  // Observables para filtrado
  filteredOptions: Observable<AutocompleteOption[]>;
  availableOptions: Observable<AutocompleteOption[]>; // Para chips (excluye seleccionados)
  
  // Referencia al elemento input y al autocomplete
  @ViewChild('autocomplete') autocompleteRef: any;
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('step2') chipSetRef!: ElementRef;

  @ViewChild('trigger') autocompleteTrigger!: MatAutocompleteTrigger;

  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};
  private disabled = false;
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    // // Configurar filtrado básico
    // this.filteredOptions = this.searchControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this.filterOptions(typeof value === 'string' ? value : value?.text || ''))
    // );
    
    // // Configurar opciones disponibles (para chips)
    // this.availableOptions = this.searchControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this.filterAvailableOptions(typeof value === 'string' ? value : value?.text || ''))
    // );
  }

  
  onInputFocus() {
    if (!this.filteredOptions) return;
    this.autocompleteRef.openPanel();
  }

  ngOnInit(): void {
    // Configurar valores por defecto
    this.config = {
      placeholder: 'Seleccionar...',
      appearance: 'outline',
      searchable: true,
      clearable: true,
      multiple: false,
      useChips: false,
      emptyMessage: 'No hay opciones disponibles',
      ...this.config
    };

    if(this.promociones && this.promociones.length > 0){
      this.options = this.promociones.map(p => ({ id: p.idPromocionPrecio, text: '[' + p.precioPromocion + '] ' + p.descripcion }));
    }

    // Configurar filtrado básico
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(typeof value === 'string' ? value : value?.text || ''))
    );
    
    // Configurar opciones disponibles (para chips)
    this.availableOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterAvailableOptions(typeof value === 'string' ? value : value?.text || ''))
    );

    // Si hay un ID preseleccionado, seleccionamos esa promoción
    setTimeout(() => {
      if (this.promocionSeleccionadaId !== null && this.promocionSeleccionadaId !== undefined) {
        this.seleccionarPromocionPorId(this.promocionSeleccionadaId);
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options) {
      console.log('Opciones cambiaron en autocomplete:', this.options);
      // Forzar actualización de los observables
      this.searchControl.updateValueAndValidity();
      this.cdr.detectChanges();
    }
    
    // Si cambia el ID de la promoción seleccionada
    if (changes['promocionSeleccionadaId'] && 
        this.promocionSeleccionadaId !== null && 
        this.promocionSeleccionadaId !== undefined) {
      // Usamos setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.seleccionarPromocionPorId(this.promocionSeleccionadaId);
      }, 0);
    }
  }
  
  testConsola(){
    this.availableOptions.subscribe(options => {
      console.log(options, "Opciones disponibles");
    })
  }
  /**
   * Selecciona una promoción por su ID
   * @param id ID de la promoción a seleccionar
   */
  seleccionarPromocionPorId(id: number | null): void {
    // Si el id es nulo, no hacemos nada
    if (id === null || id === undefined) {
      return;
    }
    
    // Primero verificamos que tengamos opciones cargadas
    if (!this.options || this.options.length === 0) {
      console.log('No hay opciones disponibles para seleccionar la promoción con ID:', id);
      return;
    }
    
    // Buscamos la opción por ID
    const opcionEncontrada = this.options.find(option => option.id === id);
    
    if (opcionEncontrada) {      
      // La establecemos como seleccionada
      this.selectedOptions = [opcionEncontrada];
      
      // Actualizamos el valor en el input
      this.searchControl.setValue(opcionEncontrada);
      
      // Actualizamos el valor del formulario
      this.updateFormValue();
      
      // Forzamos la detección de cambios
      this.cdr.detectChanges();
    } else {
      console.log('No se encontró la promoción con ID:', id);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ControlValueAccessor Implementation
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      if (this.config.multiple || this.config.useChips) {
        this.setMultipleSelection(value);
      } else {
        if (typeof value === 'number') {
          this.seleccionarPromocionPorId(value);
        } else {
          this.setSingleSelection(value);
        }
      }
    } else {
      this.clearSelection();
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.config.disabled = isDisabled;
    
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  // Métodos de filtrado
  private filterOptions(searchText: string): AutocompleteOption[] {
    console.log('Filtrando opciones:', { searchText, options: this.options });
    
    if (!this.options || this.options.length === 0) {
      console.log('No hay opciones disponibles');
      return [];
    }
    
    if (!searchText) {
      console.log('Devolviendo todas las opciones:', this.options);
      return this.options;
    }
    
    const filterValue = searchText.toLowerCase();
    const filtered = this.options.filter(option => 
      option.text && option.text.toLowerCase().includes(filterValue) && !option.disabled
    );
    
    console.log('Opciones filtradas:', filtered);
    return filtered;
  }

  private filterAvailableOptions(searchText: string): AutocompleteOption[] {
    const filtered = this.filterOptions(searchText);
    // Excluir opciones ya seleccionadas
    return filtered.filter(option => 
      !this.selectedOptions.find(selected => selected.id === option.id)
    );
  }

  // Gestión de selección
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const option: AutocompleteOption = event.option.value;
    if (this.config.multiple || this.config.useChips) {
      this.addToMultipleSelection(option);
    } else {
      this.setSingleSelection(option);
    }
    
    // Limpiar el campo de búsqueda
    this.searchControl.setValue('');
    // Emitir evento
    this.selectionChange.emit({
      option: option,
      allSelected: [...this.selectedOptions]
    });
    
    this.onTouched();

    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
    }

    if (this.inputField && this.inputField.nativeElement) {
      this.inputField.nativeElement.blur(); // Quita el foco
    }
    
    // Dar focus al contenedor de chips (step2) después de seleccionar una opción
    setTimeout(() => {
      if (this.chipSetRef && this.chipSetRef.nativeElement && this.config.useChips) {
        // Si estamos en modo chips y el elemento existe, dar focus
        this.chipSetRef.nativeElement.focus();
        // Desplazar a la vista si es necesario
        this.chipSetRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100); // Pequeño retraso para asegurar que el DOM esté actualizado
  }

  private setSingleSelection(value: any): void {
    let option: AutocompleteOption | null = null;
    
    if (typeof value === 'object' && value?.id !== undefined) {
      option = value;
    } else {
      option = this.options.find(opt => opt.id === value) || null;
    }
    
    this.selectedOptions = option ? [option] : [];
    this.updateFormValue();
    
    // Mostrar el texto seleccionado en el input
    if (option && !this.config.searchable) {
      this.searchControl.setValue(option, { emitEvent: false });
    }
  }

  private setMultipleSelection(value: any[]): void {
    if (!Array.isArray(value)) return;
    
    this.selectedOptions = [];
    value.forEach(val => {
      let option: AutocompleteOption | null = null;
      
      if (typeof val === 'object' && val?.id !== undefined) {
        option = val;
      } else {
        option = this.options.find(opt => opt.id === val) || null;
      }
      
      if (option && !this.selectedOptions.find(s => s.id === option!.id)) {
        this.selectedOptions.push(option);
      }
    });
    
    this.updateFormValue();
  }

  private addToMultipleSelection(option: AutocompleteOption): void {
    if (!this.selectedOptions.find(selected => selected.id === option.id)) {
      this.selectedOptions.push(option);
      this.updateFormValue();
    }
  }

  removeOption(option: AutocompleteOption): void {
    const index = this.selectedOptions.findIndex(selected => selected.id === option.id);
    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      this.updateFormValue();
      
      this.optionRemoved.emit({
        option: option,
        remaining: [...this.selectedOptions]
      });
    }
  }

  clearSelection(): void {
    // Limpiar selección
    this.selectedOptions = [];
    
    // Limpiar el campo de búsqueda con emisión para actualizar filtros
    this.searchControl.setValue('', { emitEvent: true });
    
    // Actualizar el valor del formulario
    this.updateFormValue();
    
    // Notificar limpieza
    this.cleared.emit();
    
    // Abrir el panel de opciones
    this.abrirPanel();
  }

  private updateFormValue(): void {
    let value: any;
    
    if (this.config.multiple || this.config.useChips) {
      // Retornar array de IDs
      value = this.selectedOptions.map(option => option.id);
    } else {
      // Retornar ID simple o null
      value = this.selectedOptions.length > 0 ? this.selectedOptions[0].id : null;
    }
    
    this.onChange(value);
  }

  // Métodos de utilidad
  displayOption(option: AutocompleteOption | null): string {
    return option ? option.text : '';
  }

  isSelected(option: AutocompleteOption): boolean {
    return this.selectedOptions.some(selected => selected.id === option.id);
  }

  hasSelection(): boolean {
    return this.selectedOptions.length > 0;
  }
  
  /**
   * Método para abrir manualmente el panel de opciones
   */
  abrirPanel(): void {
    if (this.inputField && this.inputField.nativeElement) {
      setTimeout(() => {
        this.inputField.nativeElement.focus();
        this.inputField.nativeElement.click();
      }, 0);
    }
  }

  abrirOpciones(){
      // Si el autocomplete existe
    if (this.autocompleteTrigger) {
      // Si el panel ya está abierto, no hagas nada
      if (this.autocompleteTrigger.panelOpen) return;
    }

    // 1️⃣ Si el valor está vacío, pon un espacio para disparar valueChanges
    const currentValue = this.searchControl.value;
    if (!currentValue) {
      this.searchControl.setValue('', { emitEvent: true });
    }

    // 2️⃣ Luego abre el panel manualmente
    setTimeout(() => {
      if (this.autocompleteTrigger) {
        this.autocompleteTrigger.openPanel();
      }
    }, 100);
  }
}

