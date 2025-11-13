# Componente Autocomplete Centralizado

## Descripción
Componente reutilizable de autocomplete con soporte para Material Design, Angular Forms y múltiples modos de selección.

## Características
- ✅ Selección simple y múltiple
- ✅ Modo chips para visualización de selecciones múltiples
- ✅ Búsqueda en tiempo real
- ✅ Integración con Angular Reactive Forms
- ✅ Completamente tipado con TypeScript
- ✅ Configuración flexible mediante opciones
- ✅ Soporte para iconos en opciones
- ✅ Eventos personalizados para selección y eliminación

## Instalación
```typescript
// En tu módulo
import { AutocompleteSelectModule } from '../../../shared/components/autocomplete-select';

@NgModule({
  imports: [
    // ... otros imports
    AutocompleteSelectModule
  ]
})
```

## Ejemplos de Uso

### 1. Selección Simple
```html
<app-autocomplete-select
  [options]="opciones"
  [config]="{
    placeholder: 'Seleccionar usuario...',
    label: 'Usuario',
    searchable: true
  }"
  (selectionChange)="onUsuarioSelected($event)">
</app-autocomplete-select>
```

```typescript
export class MiComponente {
  opciones: AutocompleteOption[] = [
    { id: 1, text: 'Usuario 1' },
    { id: 2, text: 'Usuario 2' },
    { id: 3, text: 'Usuario 3' }
  ];

  onUsuarioSelected(event: AutocompleteSelectionEvent) {
    console.log('Usuario seleccionado:', event.option);
  }
}
```

### 2. Selección Múltiple con Chips
```html
<app-autocomplete-select
  [options]="zonasCorporales"
  [config]="{
    placeholder: 'Buscar zonas corporales...',
    label: 'Zonas Corporales',
    multiple: true,
    useChips: true,
    clearable: true,
    prefixIcon: 'search'
  }"
  (selectionChange)="onZonasSelected($event)"
  (optionRemoved)="onZonaRemoved($event)">
</app-autocomplete-select>
```

```typescript
export class ZonasComponent {
  zonasCorporales: AutocompleteOption[] = [
    { id: 1, text: 'Rostro', icon: 'face' },
    { id: 2, text: 'Brazos', icon: 'accessibility' },
    { id: 3, text: 'Piernas', icon: 'directions_walk' }
  ];

  onZonasSelected(event: AutocompleteSelectionEvent) {
    console.log('Zonas seleccionadas:', event.allSelected);
  }

  onZonaRemoved(event: AutocompleteRemoveEvent) {
    console.log('Zona eliminada:', event.option);
    console.log('Zonas restantes:', event.remaining);
  }
}
```

### 3. Integración con Formularios Reactivos
```html
<form [formGroup]="miFormulario">
  <app-autocomplete-select
    formControlName="sedeId"
    [options]="sedes"
    [config]="{
      placeholder: 'Seleccionar sede...',
      label: 'Sede',
      required: true
    }">
  </app-autocomplete-select>
</form>
```

```typescript
export class FormularioComponent {
  miFormulario = this.fb.group({
    sedeId: ['', Validators.required]
  });

  sedes: AutocompleteOption[] = [
    { id: 1, text: 'Sede Lima Centro' },
    { id: 2, text: 'Sede San Isidro' },
    { id: 3, text: 'Sede Miraflores' }
  ];
}
```

## Interfaces

### AutocompleteOption
```typescript
interface AutocompleteOption {
  id: string | number;
  text: string;
  icon?: string;          // Nombre del icono Material
  disabled?: boolean;     // Si está deshabilitado
  metadata?: any;         // Datos adicionales
}
```

### AutocompleteConfig
```typescript
interface AutocompleteConfig {
  placeholder?: string;   // Placeholder del input
  label?: string;         // Label del form field
  appearance?: 'fill' | 'outline' | 'legacy' | 'standard';
  prefixIcon?: string;    // Icono prefijo
  suffixIcon?: string;    // Icono sufijo
  required?: boolean;     // Campo requerido
  disabled?: boolean;     // Campo deshabilitado
  multiple?: boolean;     // Selección múltiple
  useChips?: boolean;     // Usar chips para múltiple
  clearable?: boolean;    // Botón de limpiar
  searchable?: boolean;   // Permitir búsqueda
  emptyMessage?: string;  // Mensaje cuando no hay opciones
  maxHeight?: string;     // Altura máxima del panel
  width?: string;         // Ancho del componente
  customClasses?: string; // Clases CSS adicionales
}
```

### Eventos
```typescript
interface AutocompleteSelectionEvent {
  option: AutocompleteOption;
  allSelected: AutocompleteOption[];
}

interface AutocompleteRemoveEvent {
  option: AutocompleteOption;
  remaining: AutocompleteOption[];
}
```

## Casos de Uso Implementados

### ✅ Zona Corporal Seleccionar
- **Ubicación**: `componentes/zona-corporal/zona-corporal-seleccionar`
- **Configuración**: Múltiple con chips, búsqueda habilitada
- **Características**: Preselección de zonas existentes, eliminación individual

### ✅ Eventos (Usuario Remoto)
- **Ubicación**: `pagina/eventos`
- **Configuración**: Selección simple, dos autocompletes independientes
- **Características**: Acciones "Cerrar Sesión" y "Actualizar Sistema"

## Próximas Implementaciones
- [ ] Cliente Asignación (selección de sede)
- [ ] Reporte Cita Asignación
- [ ] Documento Datos
- [ ] Otros módulos según necesidades

## Notas Técnicas
- Compatible con Angular 10+
- Requiere Angular Material
- Implementa ControlValueAccessor para formularios reactivos
- Soporte completo para TypeScript
- Estilos responsivos incluidos