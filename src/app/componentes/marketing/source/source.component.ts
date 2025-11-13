import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarketingService, UtmSource } from '../../../shared/services/marketing.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

// Interface para Source (adaptada a la estructura de la API)
interface Source {
  id?: number;
  name: string;
  createdAt?: Date;
  active: boolean;
}

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit, AfterViewInit, OnDestroy {
  // Lista de sources
  sources: Source[] = [];
  dataSource: MatTableDataSource<Source> = new MatTableDataSource<Source>([]);
  displayedColumns: string[] = ['name', 'createdAt', 'active', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  // Source seleccionado y modo de edición
  selectedSource: Source | null = null;
  isEditMode: boolean = false;
  
  // Formulario
  sourceForm: FormGroup;
  
  // Término de búsqueda
  searchTerm: string = '';
  
  // Suscripción para resultados de búsqueda
  private searchSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    // Inicializar formulario
    this.sourceForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      active: [true]
    });
    
  }

  ngOnInit(): void {
    // Cargar los sources desde la API
    this.loadSources();
    
    // Suscribirse a los resultados de búsqueda con debounce
    this.searchSubscription = this.marketingService.sourceSearchResults$.subscribe({
      next: (utmSources) => this.handleSearchResults(utmSources),
      error: (error) => {
        console.error('Error al buscar fuentes UTM:', error);
        this.showNotification('Error al buscar fuentes', 'error');
      }
    });
    
    // Establecer el tamaño inicial en 10 elementos
    setTimeout(() => {
      if (this.paginator && window.innerWidth >= 768) {
        this.paginator.pageSize = 10;
      }
    });
  }
  
  ngOnDestroy(): void {
    // Cancelar suscripciones al destruir el componente
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  
  /**
   * Carga las fuentes UTM desde el servicio
   */
  loadSources(): void {
    this.marketingService.getUtmSources()
      .subscribe({
        next: (utmSources) => {
          // Mapear los UTM Sources al formato que espera el componente
          this.sources = utmSources.map(utm => ({
            id: utm.id,
            name: utm.titulo,
            active: utm.estado,
            createdAt: utm.createdAt ? new Date(utm.createdAt) : undefined
          }));
          
          this.dataSource = new MatTableDataSource<Source>(this.sources);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          console.error('Error al cargar las fuentes UTM:', error);
          this.showNotification('Error al cargar las fuentes UTM', 'error');
        }
      });
  }

  ngAfterViewInit(): void {
    // Configurar el paginador y el ordenamiento después de que la vista se haya inicializada
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Personalizar los textos del paginador en español
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = 'Items por página:';
      this.paginator._intl.nextPageLabel = 'Siguiente';
      this.paginator._intl.previousPageLabel = 'Anterior';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 de ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      
      // Ajustar tamaño de página según el ancho de la pantalla
      this.setPageSizeBasedOnScreenWidth();
      
      // Escuchar cambios en el tamaño de la ventana para ajustar el tamaño de página
      window.addEventListener('resize', () => {
        this.setPageSizeBasedOnScreenWidth();
      });
    }
  }
  
  /**
   * Ajusta el tamaño de página según el ancho de la pantalla
   */
  setPageSizeBasedOnScreenWidth(): void {
    if (window.innerWidth < 768) {
      // En móviles, mostrar menos items por página
      if (this.paginator && this.paginator.pageSize !== 5) {
        this.paginator.pageSize = 5;
        this.paginator.firstPage();
      }
    } else {
      // En pantallas más grandes, mostrar 10 items por página
      if (this.paginator && this.paginator.pageSize !== 10) {
        this.paginator.pageSize = 10;
      }
    }
  }

  /**
   * Muestra una notificación usando MatSnackBar
   * @param message Mensaje a mostrar
   * @param type Tipo de notificación: success, error, info
   */
  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    let panelClass = ['notification'];
    
    switch (type) {
      case 'success':
        panelClass.push('notification-success');
        break;
      case 'error':
        panelClass.push('notification-error');
        break;
      case 'info':
        panelClass.push('notification-info');
        break;
    }
    
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: panelClass
    });
  }

  /**
   * Procesa los resultados de búsqueda
   */
  handleSearchResults(utmSources: UtmSource[]): void {
    // Mapear los UTM Sources al formato que espera el componente
    this.sources = utmSources.map(utm => ({
      id: utm.id,
      name: utm.titulo,
      active: utm.estado,
      createdAt: utm.createdAt ? new Date(utm.createdAt) : undefined
    }));
    
    this.dataSource.data = this.sources;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Filtra los sources según el término de búsqueda
   * con debounce para reducir peticiones
   */
  filterSources(): void {
    const searchTerm = this.searchTerm.trim().toLowerCase();
    
    if (searchTerm) {
      // Usa el método con debounce para evitar múltiples peticiones
      this.marketingService.searchSourcesWithDebounce(searchTerm);
    } else {
      this.loadSources();
    }
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Selecciona un source de la lista
   */
  selectSource(source: Source): void {
    this.selectedSource = source;
  }

  /**
   * Inicia la edición de un source
   */
  editSource(source: Source): void {
    this.isEditMode = true;
    this.selectedSource = source;
    
    this.sourceForm.patchValue({
      id: source.id,
      name: source.name,
      active: source.active
    });
  }

  /**
   * Guarda un source (crear o actualizar)
   */
  saveSource(): void {
    if (this.sourceForm.invalid) {
      return;
    }
    
    const formValues = this.sourceForm.value;
    
    if (this.isEditMode && this.selectedSource && this.selectedSource.id) {
      // Crear objeto para actualizar según la estructura de la API
      const utmSourceToUpdate = {
        titulo: formValues.name,
        estado: formValues.active
      };
      
      // Actualizar source existente
      this.marketingService.updateUtmSource(this.selectedSource.id, utmSourceToUpdate)
        .subscribe({
          next: (updatedSource) => {
            // Mapear la respuesta al formato del componente
            const mappedSource: Source = {
              id: updatedSource.id,
              name: updatedSource.titulo,
              active: updatedSource.estado,
              createdAt: updatedSource.createdAt ? new Date(updatedSource.createdAt) : undefined
            };
            
            // Actualizar en el array local
            const index = this.sources.findIndex(s => s.id === mappedSource.id);
            if (index !== -1) {
              this.sources[index] = mappedSource;
            }
            
            // Actualizar el source seleccionado
            this.selectedSource = mappedSource;
            
            // Actualizar el datasource
            this.dataSource.data = [...this.sources];
            
            // Mostrar mensaje de éxito
            this.showNotification('Fuente UTM actualizada correctamente', 'success');
            
            // Resetear formulario y estado
            this.resetForm();
          },
          error: (error) => {
            console.error('Error al actualizar la fuente UTM:', error);
            this.showNotification('Error al actualizar la fuente UTM', 'error');
          }
        });
    } else {
      // Crear objeto para enviar según la estructura de la API
      const utmSourceToCreate = {
        titulo: formValues.name,
        estado: formValues.active
      };
      
      // Crear nueva fuente UTM
      this.marketingService.createUtmSource(utmSourceToCreate)
        .subscribe({
          next: (newUtmSource) => {
            // Mapear la respuesta al formato del componente
            const newSource: Source = {
              id: newUtmSource.id,
              name: newUtmSource.titulo,
              active: newUtmSource.estado,
              createdAt: newUtmSource.createdAt ? new Date(newUtmSource.createdAt) : undefined
            };
            
            // Agregar al principio del array
            this.sources.unshift(newSource);
            this.selectedSource = newSource;
            
            // Actualizar el datasource
            this.dataSource.data = [...this.sources];
            
            // Mostrar mensaje de éxito
            this.showNotification('Fuente UTM creada correctamente', 'success');
            
            // Resetear formulario y estado
            this.resetForm();
          },
          error: (error) => {
            console.error('Error al crear la fuente UTM:', error);
            this.showNotification('Error al crear la fuente UTM', 'error');
          }
        });
    }
    
    // Aplicar filtro actual
    if (this.searchTerm) {
      this.filterSources();
    }
    
    // Resetear formulario y estado
    this.resetForm();
  }

  /**
   * Resetea el formulario
   */
  resetForm(): void {
    this.sourceForm.reset({
      id: null,
      name: '',
      active: true
    });
    
    this.isEditMode = false;
    
    // Aplicar animación de reset
    const formElement = document.querySelector('.source-form');
    if (formElement) {
      formElement.classList.add('form-reset-animation');
      setTimeout(() => {
        formElement.classList.remove('form-reset-animation');
      }, 500);
    }
  }

  /**
   * Este método ya no es necesario porque la API genera el ID
   * Lo dejamos comentado para referencia futura
   */
  /*
  getNextId(): number {
    return this.sources.length > 0 
      ? Math.max(...this.sources.filter(s => s.id !== undefined).map(s => s.id as number)) + 1 
      : 1;
  }
  */
}
