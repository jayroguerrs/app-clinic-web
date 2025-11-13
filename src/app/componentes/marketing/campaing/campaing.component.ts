import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MarketingService, UtmSource, UtmCampaign, ShortUtmSource } from '../../../shared/services/marketing.service';
import { filterActiveIdAndTitle } from '../../../shared/services/funciones/data-cleaner';
import { Subscription, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

// Interface para Campaign (adaptada a la estructura de la API)
interface Campaign {
  id?: number;
  name: string;
  sourceId: number;
  sourceName: string;
  createdAt?: Date;
  active: boolean;
}

@Component({
  selector: 'app-campaing',
  templateUrl: './campaing.component.html',
  styleUrls: ['./campaing.component.scss']
})
export class CampaingComponent implements OnInit, AfterViewInit, OnDestroy {
  // Lista de campaigns
  campaigns: Campaign[] = [];
  dataSource: MatTableDataSource<Campaign> = new MatTableDataSource<Campaign>([]);
  displayedColumns: string[] = ['name', 'sourceName', 'createdAt', 'active', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  // Campaign seleccionado y modo de edición
  selectedCampaign: Campaign | null = null;
  isEditMode: boolean = false;
  
  // Formulario
  campaignForm: FormGroup;
  
  // Término de búsqueda
  searchTerm: string = '';
  
  // Lista de sources disponibles para el select
  sourceOptions: ShortUtmSource[] = [];
  filteredSourceOptions!: Observable<ShortUtmSource[]>;
  
  // Suscripción para resultados de búsqueda
  private searchSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private marketingService: MarketingService,
    private spinner: NgxSpinnerService
  ) {
    // Inicializar formulario
    this.campaignForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      sourceId: ['', [Validators.required]],
      sourceInput: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    // Primero cargar las fuentes y luego las campañas para asegurar que tenemos los nombres correctos
    this.loadSources();
    
    // Suscribirse a los resultados de búsqueda con debounce
    this.searchSubscription = this.marketingService.campaignSearchResults$.subscribe({
      next: (utmCampaigns) => this.handleSearchResults(utmCampaigns),
      error: (error) => {
        console.error('Error al buscar campañas UTM:', error);
        this.showNotification('Error al buscar campañas', 'error');
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
   * Carga las campañas UTM desde el servicio
   */
  loadCampaigns(): void {
    this.marketingService.getUtmCampaigns()
      .subscribe({
        next: (utmCampaigns) => {
          // Mapear los datos de la API al formato que espera el componente
          this.campaigns = utmCampaigns.map(campaign => {
            // Buscar el nombre del source correspondiente
            const source = this.sourceOptions.find(s => s.id === campaign.fk_id_utm);

            return {
              id: campaign.id,
              name: campaign.titulo,
              sourceId: campaign.fk_id_utm,
              sourceName: source ? source.titulo : 'Desconocido',
              createdAt: campaign.createdAt ? new Date(campaign.createdAt) : undefined,
              active: campaign.estado
            };
          });
          
          this.dataSource = new MatTableDataSource<Campaign>(this.campaigns);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          console.error('Error al cargar las campañas UTM:', error);
          this.showNotification('Error al cargar las campañas', 'error');
        }
      });
  }
  
  /**
   * Carga las fuentes UTM para el select
   */
  loadSources(): void {
    // Mostrar el spinner durante la carga
    
    this.marketingService.getShortUtmSources()
      .subscribe({
        next: (sources) => {
          console.log(sources, "sourceeeeeeeeeeeeeeeeee=====================");
          this.sourceOptions = sources;
          
          // Configurar el filtrado para autocomplete
          this.setupSourceAutocomplete();
          
          // Una vez que tenemos las fuentes, cargamos las campañas
          this.loadCampaigns();
        },
        error: (error) => {
          console.error('Error al cargar las fuentes UTM:', error);
          this.showNotification('Error al cargar las fuentes', 'error');
        }
      });
  }

  ngAfterViewInit(): void {
    // Configurar el paginador y el ordenamiento después de que la vista se haya inicializado
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
   * Este método ya no es necesario porque cargamos datos de la API
   */
  /* generateFakeData() - Eliminado */

  /**
   * Procesa los resultados de búsqueda 
   */
  handleSearchResults(utmCampaigns: UtmCampaign[]): void {
    // Mapear los datos de la API al formato que espera el componente
    this.campaigns = utmCampaigns.map(campaign => {
      // Buscar el nombre del source correspondiente
      const source = this.sourceOptions.find(s => s.id === campaign.fk_id_utm);

      return {
        id: campaign.id,
        name: campaign.titulo,
        sourceId: campaign.fk_id_utm,
        sourceName: source ? source.titulo : 'Desconocido',
        createdAt: campaign.createdAt ? new Date(campaign.createdAt) : undefined,
        active: campaign.estado
      };
    });
    
    this.dataSource.data = this.campaigns;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Filtra las campañas según el término de búsqueda
   * con debounce para reducir peticiones
   */
  filterCampaigns(): void {
    const searchTerm = this.searchTerm.trim().toLowerCase();
    
    if (searchTerm) {
      // Usa el método con debounce para evitar múltiples peticiones
      this.marketingService.searchCampaignsWithDebounce(searchTerm);
    } else {
      this.loadCampaigns();
    }
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Selecciona una campaña de la lista
   */
  selectCampaign(campaign: Campaign): void {
    this.selectedCampaign = campaign;
  }

  /**
   * Inicia la edición de una campaña
   */
  editCampaign(campaign: Campaign): void {
    this.isEditMode = true;
    this.selectedCampaign = campaign;
    
    // Encontrar el objeto source completo para el autocomplete
    const selectedSource = this.sourceOptions.find(s => s.id === campaign.sourceId);
    
    this.campaignForm.patchValue({
      id: campaign.id,
      name: campaign.name,
      sourceId: campaign.sourceId,
      sourceInput: selectedSource || null,
      active: campaign.active
    });
  }

  /**
   * Guarda una campaña (crear o actualizar)
   */
  saveCampaign(): void {
    if (this.campaignForm.invalid) {
      return;
    }
    
    const formValues = this.campaignForm.value;
    const sourceId = parseInt(formValues.sourceId);
    const selectedSource = this.sourceOptions.find(s => s.id === sourceId);
    
    if (this.isEditMode && this.selectedCampaign && this.selectedCampaign.id) {
      // Crear objeto para actualizar según la estructura de la API
      const utmCampaignToUpdate = {
        titulo: formValues.name,
        estado: formValues.active,
        fk_id_utm: sourceId
      };
      
      // Actualizar campaña existente
      this.marketingService.updateUtmCampaign(this.selectedCampaign.id, utmCampaignToUpdate)
        .subscribe({
          next: (updatedUtmCampaign) => {
            // Buscar el nombre del source correspondiente
            const source = this.sourceOptions.find(s => s.id === updatedUtmCampaign.fk_id_utm);
            
            // Mapear la respuesta al formato del componente
            const updatedCampaign: Campaign = {
              id: updatedUtmCampaign.id,
              name: updatedUtmCampaign.titulo,
              sourceId: updatedUtmCampaign.fk_id_utm,
              sourceName: source ? source.titulo : 'Desconocido',
              createdAt: updatedUtmCampaign.createdAt ? new Date(updatedUtmCampaign.createdAt) : undefined,
              active: updatedUtmCampaign.estado
            };
            
            // Actualizar en el array local
            const index = this.campaigns.findIndex(c => c.id === updatedCampaign.id);
            if (index !== -1) {
              this.campaigns[index] = updatedCampaign;
            }
            
            // Actualizar la campaña seleccionada
            this.selectedCampaign = updatedCampaign;
            
            // Actualizar el datasource
            this.dataSource.data = [...this.campaigns];
            
            // Mostrar mensaje de éxito
            this.showNotification('Campaña actualizada correctamente', 'success');
            
            // Resetear formulario y estado
            this.resetForm();
          },
          error: (error) => {
            console.error('Error al actualizar la campaña UTM:', error);
            this.showNotification('Error al actualizar la campaña', 'error');
          }
        });
    } else {
      // Crear objeto para enviar según la estructura de la API
      const utmCampaignToCreate = {
        titulo: formValues.name,
        estado: formValues.active,
        fk_id_utm: sourceId
      };
      
      // Crear nueva campaña UTM
      this.marketingService.createUtmCampaign(utmCampaignToCreate)
        .subscribe({
          next: (newUtmCampaign) => {
            // Buscar el nombre del source correspondiente
            const source = this.sourceOptions.find(s => s.id === newUtmCampaign.fk_id_utm);
            
            // Mapear la respuesta al formato del componente
            const newCampaign: Campaign = {
              id: newUtmCampaign.id,
              name: newUtmCampaign.titulo,
              sourceId: newUtmCampaign.fk_id_utm,
              sourceName: source ? source.titulo : 'Desconocido',
              createdAt: newUtmCampaign.createdAt ? new Date(newUtmCampaign.createdAt) : undefined,
              active: newUtmCampaign.estado
            };
            
            // Agregar al principio del array
            this.campaigns.unshift(newCampaign);
            this.selectedCampaign = newCampaign;
            
            // Actualizar el datasource
            this.dataSource.data = [...this.campaigns];
            
            // Mostrar mensaje de éxito
            this.showNotification('Campaña creada correctamente', 'success');
            
            // Resetear formulario y estado
            this.resetForm();
          },
          error: (error) => {
            console.error('Error al crear la campaña UTM:', error);
            this.showNotification('Error al crear la campaña', 'error');
          }
        });
    }
    
    // Aplicar filtro actual
    if (this.searchTerm) {
      this.filterCampaigns();
    }
    
    // Resetear formulario y estado
    this.resetForm();
  }

  /**
   * Resetea el formulario
   */
  resetForm(): void {
    this.campaignForm.reset({
      id: null,
      name: '',
      sourceId: '',
      sourceInput: '',
      active: true
    });
    
    this.isEditMode = false;
    
    // Aplicar animación de reset
    const formElement = document.querySelector('.campaign-form');
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
    return this.campaigns.length > 0 
      ? Math.max(...this.campaigns.filter(c => c.id !== undefined).map(c => c.id as number)) + 1 
      : 1;
  }
  */
  
  /**
   * Obtiene el nombre de un source por su ID
   */
  getSourceName(sourceId: any): string {
    // Convertir a número para asegurar la comparación correcta
    const sourceIdNum = parseInt(sourceId);
    const source = this.sourceOptions.find(s => s.id === sourceIdNum);
    return source ? source.titulo : '';
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
   * Configura el filtrado de autocomplete para los sources
   */
  setupSourceAutocomplete(): void {
    // Inicializar el autocomplete con todos los sources
    this.filteredSourceOptions = this.campaignForm.get('sourceInput')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.titulo;
        return name ? this._filterSources(name as string) : this.sourceOptions.slice();
      })
    );
  }

  /**
   * Filtra los sources por nombre para el autocomplete
   */
  private _filterSources(value: string): ShortUtmSource[] {
    const filterValue = value.toLowerCase();
    return this.sourceOptions.filter(source => source.titulo.toLowerCase().includes(filterValue));
  }

  /**
   * Función para mostrar el nombre del source en el autocomplete
   */
  displaySourceFn(source: ShortUtmSource): string {
    return source && source.titulo ? source.titulo : '';
  }

  /**
   * Maneja la selección de un source en el autocomplete
   */
  onSourceSelected(event: MatAutocompleteSelectedEvent): void {
    const source = event.option.value as ShortUtmSource;
    this.campaignForm.get('sourceId')!.setValue(source.id);
  }
}