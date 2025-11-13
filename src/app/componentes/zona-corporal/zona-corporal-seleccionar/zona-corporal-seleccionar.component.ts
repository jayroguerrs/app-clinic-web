import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, VERSION, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ZonaCorporalService } from 'src/app/shared/services/zona-corporal.service';
import { 
  AutocompleteOption, 
  AutocompleteConfig, 
  AutocompleteSelectionEvent, 
  AutocompleteRemoveEvent, 
  AutocompleteSelectComponent
} from '../../../shared/components/autocomplete-select';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-zona-corporal-seleccionar',
  templateUrl: './zona-corporal-seleccionar.component.html',
  styleUrls: ['./zona-corporal-seleccionar.component.scss']
})
export class ZonaCorporalSeleccionarComponent implements OnInit, AfterViewInit {
  @Input() modal: NgbModalRef;
  @Input() zonasSeleccionadas: any;
  @Input() idGenero: number;
  @Input() idServicio: number = 0;
  @Output() eventoZonasSeleccionadas: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() eventoZonasConcatenadas: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventoIdsZonasConcatenadas: EventEmitter<string> = new EventEmitter<string>();


  @Input() idPromocion: number | null = null;
  @ViewChild('autocompleteSelect') autocompleteSelectComponent: AutocompleteSelectComponent;

  // Propiedades del componente original
  listaZonaCorporal: any = [];
  textBuscar:string = "";
  frmZonaCorporalListado: FormGroup;
  name:string;
  selected_count:number = 0;
  tituloGenero: string = '';
  
  testCondicional: boolean = false;

  // Propiedades para el nuevo autocomplete
  zonasOptions: AutocompleteOption[] = [];
  autocompleteConfig: AutocompleteConfig = {
    placeholder: 'Buscar y seleccionar zonas corporales...',
    label: 'Zonas Corporales',
    appearance: 'outline',
    multiple: true,
    useChips: true,
    clearable: true,
    searchable: true,
    emptyMessage: 'No se encontraron zonas corporales',
    prefixIcon: 'search'
  };

  constructor(
    private zonaCorporalService: ZonaCorporalService,
    private spinner: NgxSpinnerService
  ) {
    this.name = `Angular! v${VERSION.full}`;
    this.getSeleccionadas();
  }

  ngOnInit(): void {
    this.tituloGenero = (this.idGenero == 0 ? '( TODOS )' : this.idGenero == 1 ? '( MASCULINO )' : '( FEMENINO )');
    
    // Inicializar zonasSeleccionadas si no existe
    if (!this.zonasSeleccionadas) {
      this.zonasSeleccionadas = [];
    } else {
      console.log('Zonas seleccionadas al inicializar:', this.zonasSeleccionadas);
    }
    
    // Cargar las zonas corporales
    this.zonaCorporalListado();
    this.inicializarFormulario();
  }
  
  ngAfterViewInit(): void {
    // Esperar un poco para asegurarnos de que tanto el autocompleteSelectComponent como las opciones estén listas
    setTimeout(() => {
      if (this.zonasSeleccionadas && this.zonasSeleccionadas.length > 0) {
        console.log('ngAfterViewInit: Preseleccionando zonas después de cargar la vista');
        this.preseleccionarZonas();
        
        // Forzar una actualización adicional después de un tiempo mayor
        // Esto ayuda con problemas de sincronización en Angular
        setTimeout(() => {
          if (this.autocompleteSelectComponent && 
              this.autocompleteSelectComponent.selectedOptions.length !== this.zonasSeleccionadas.length) {
            console.log('Realizando actualización secundaria de zonas seleccionadas');
            this.preseleccionarZonas();
          }
        }, 1000);
      }
    }, 500);
  }
  inicializarFormulario(): void {
  }
  zonaCorporalListado(): void {
    this.spinner.show();
    console.log('Cargando zonas corporales con idPromocion:', this.idPromocion);

    if( !this.idPromocion ) {
      this.zonaCorporalService.zonaCorporalByGeneroByServicioListar(this.idGenero, this.idServicio).subscribe(
        (resultado: any) => {
          console.log('Zonas cargadas por género y servicio:', resultado);
          
          // Guardar la lista original
          this.listaZonaCorporal = resultado;
          
          // Marcar como seleccionadas las zonas que ya están en zonasSeleccionadas
          this.marcarZonasSeleccionadas();
          
          // Convertir a opciones de autocomplete
          this.convertirAOpciones(resultado);
          this.spinner.hide();
        },
        (error: any) => {
          console.log('Error al obtener el listado de Zonas Corporales', error);
          this.spinner.hide();
        }
      );
    } else {
      this.zonaCorporalService.zonaCorporalByGeneroByPromocionByServicioListar(this.idGenero, this.idPromocion, this.idServicio).subscribe(
        (resultado: any) => {
          console.log('Zonas cargadas por género, promoción y servicio:', resultado);
          
          
          // Guardar la lista original
          this.listaZonaCorporal = resultado;
          
          // Marcar como seleccionadas las zonas que ya están en zonasSeleccionadas
          this.marcarZonasSeleccionadas();
          
          // Convertir a opciones de autocomplete
          this.convertirAOpciones(resultado);
          this.spinner.hide();
        },
        (error: any) => {
          console.log('Error al obtener el listado de Zonas Corporales', error);
          this.spinner.hide();
        }
      );

    }
  }

  get f(): any {
    return this.frmZonaCorporalListado.controls;
  }

  // Getting Selected Games and Count (Método legacy - mantener para compatibilidad)
  getSeleccionadas(){
    // Solo inicializamos el array si está vacío o no existe
    if (!this.zonasSeleccionadas || this.zonasSeleccionadas.length === 0) {
      const datos = this.listaZonaCorporal.filter((s: any) => { return s.seleccionado; });
      this.zonasSeleccionadas = [];
      datos.forEach((element: any) => {
        this.zonasSeleccionadas.push({
          id: 0,
          idZonaCorporal: element.id,
          descripcion: element.descripcion,
          seleccionado: element.seleccionado
        });
      });
    }
    
    // Actualizar contador
    this.selected_count = this.zonasSeleccionadas.length;
    console.log('Zonas seleccionadas en getSeleccionadas():', this.zonasSeleccionadas);
  }

  // Mantener compatibilidad con método eliminarZona para casos específicos
  eliminarZona(id:number){
    this.zonasSeleccionadas = this.zonasSeleccionadas.filter((z: any) => z.idZonaCorporal != id);
  }
  
  limpiarFiltro(){
    this.textBuscar = "";
  }
  cerrarModal(): void {
    this.modal.close();
  }
  aceptarCambios(): void {
    // Ya no necesitamos llamar a getSeleccionadas() aquí, ya que ahora mantiene las selecciones del autocomplete
    // this.getSeleccionadas();
    
    console.log('Zonas seleccionadas antes de emitir:', this.zonasSeleccionadas);
    
    // Si no hay zonas seleccionadas, mostrar un mensaje
    if (!this.zonasSeleccionadas || this.zonasSeleccionadas.length === 0) {
      console.warn('No hay zonas seleccionadas');
      // Podrías mostrar un mensaje al usuario aquí
    }
    
    // Emitir eventos
    this.eventoZonasSeleccionadas.emit([...this.zonasSeleccionadas]);
    
    const zonasConcatenadas = this.concatenarZonas(this.zonasSeleccionadas);
    this.eventoZonasConcatenadas.emit(zonasConcatenadas);
    console.log('Zonas concatenadas:', zonasConcatenadas);
    
    const idsZonas = this.concatenarIdsZonas(this.zonasSeleccionadas);
    this.eventoIdsZonasConcatenadas.emit(idsZonas);
    console.log('IDs de zonas:', idsZonas);
    
    // Cerrar modal
    this.modal.close();
  }
  concatenarZonas(zonasSeleccionadas: any): string {
    let zonasConcatenas = '';
    zonasSeleccionadas.forEach((elemento: any) => {
      zonasConcatenas += elemento.descripcion + ', ';
    })
    if(zonasConcatenas.length > 0 ) {
      zonasConcatenas = zonasConcatenas.substring(0, zonasConcatenas.length - 2) + '.';
    }
    return zonasConcatenas;
  }
  concatenarIdsZonas(zonasSeleccionadas: any): string {
    let zonasConcatenas = '';
    zonasSeleccionadas.forEach((elemento: any) => {
      zonasConcatenas += elemento.idZonaCorporal + ',';
    })
    if(zonasConcatenas.length > 0 ) {
      zonasConcatenas = zonasConcatenas.substring(0, zonasConcatenas.length - 1);
    }
    return zonasConcatenas;
  }

  // Nuevos métodos para manejar el autocomplete
  convertirAOpciones(zonas: any[]): void {
    console.log(zonas, "=================zonas a convertir ===================");
    this.zonasOptions = zonas.map(zona => ({
      id: zona.id,
      text: this.idGenero == 0 ? `${zona.descripcion} - ${zona.genero}` : zona.descripcion,
      // metadata: zona
    }));
    
    // Preseleccionar zonas que ya están en la lista de seleccionadas
    // Esperar un poco más para que el componente autocomplete se inicialice completamente
    setTimeout(() => {
      this.preseleccionarZonas();
    }, 300);
  }
  
  private preseleccionarZonas(): void {
    if (!this.zonasSeleccionadas || !this.autocompleteSelectComponent) {
      console.log('No hay zonas seleccionadas o no se ha cargado el componente autocomplete');
      return;
    }
    
    console.log('Preseleccionando zonas:', this.zonasSeleccionadas);
    
    // Verificar si hay zonas seleccionadas
    if (this.zonasSeleccionadas.length > 0) {
      // Mapear las zonas seleccionadas al formato esperado por el autocomplete
      const zonasParaAutocomplete = this.zonasSeleccionadas.map((zona: any) => {
        // Buscar la zona en las opciones disponibles por ID
        const zonaId = zona.idZonaCorporal || zona.id;
        const zonaOption = this.zonasOptions.find(opt => opt.id === zonaId);
        
        if (zonaOption) {
          console.log('Zona encontrada en opciones:', zonaOption);
          return zonaOption;
        } else {
          // Si no la encuentra en las opciones, crear una nueva opción
          console.log('Creando nueva opción para zona:', zona);
          return {
            id: zonaId,
            text: zona.descripcion || zona.nombre || `Zona ${zonaId}`
          };
        }
      });
      
      console.log('Zonas mapeadas para autocomplete:', zonasParaAutocomplete);
      
      // Establecer las selecciones en el componente autocomplete
      if (zonasParaAutocomplete.length > 0) {
        this.autocompleteSelectComponent.selectedOptions = [...zonasParaAutocomplete];
        
        // Forzar la actualización del valor usando writeValue
        this.autocompleteSelectComponent.writeValue(zonasParaAutocomplete);
        
        // Forzar detección de cambios
        setTimeout(() => {
          if (this.autocompleteSelectComponent) {
            console.log('Verificando selecciones después de escribir valor:', 
                      this.autocompleteSelectComponent.selectedOptions);
          }
        }, 100);
      }
    } else {
      console.log('No hay zonas seleccionadas para preseleccionar');
    }
  }

  onZonaSelected(event: AutocompleteSelectionEvent): void {
    console.log('Zona seleccionada en autocomplete:', event.option);
    
    // Buscar la zona completa en la lista original
    const zonaCompleta = this.listaZonaCorporal.find((z: any) => z.id == event.option.id);
    
    if (zonaCompleta) {
      console.log('Zona completa encontrada:', zonaCompleta);
      
      // Verificar si ya existe para evitar duplicados
      const yaExiste = this.zonasSeleccionadas.find((z: any) => z.idZonaCorporal == zonaCompleta.id);
      
      if (!yaExiste) {
        // Crear objeto con la estructura requerida
        const nuevaZona = {
          id: 0,
          idZonaCorporal: zonaCompleta.id,
          descripcion: zonaCompleta.descripcion,
          seleccionado: true
        };
        
        // Agregar a la lista de seleccionados
        this.zonasSeleccionadas.push(nuevaZona);
        
        // Actualizar la propiedad seleccionado en la lista original
        const index = this.listaZonaCorporal.findIndex(z => z.id === zonaCompleta.id);
        if (index >= 0) {
          this.listaZonaCorporal[index].seleccionado = true;
        }
        
        console.log('Zona agregada, lista actualizada:', this.zonasSeleccionadas);
      } else {
        console.log('La zona ya estaba seleccionada');
      }
    } else {
      console.error('No se encontró la zona completa para el ID:', event.option.id);
    }
  }

  onZonaRemoved(event: AutocompleteRemoveEvent): void {
    // Remover de la lista de seleccionadas
    this.zonasSeleccionadas = this.zonasSeleccionadas.filter(
      (z: any) => z.idZonaCorporal != event.option.id
    );
  }

  onZonasCleared(): void {
    this.zonasSeleccionadas = [];
  }

  // Actualizar métodos existentes para mantener compatibilidad
  eliminarSeleccionados(): void {
    this.zonasSeleccionadas = [];
    // this.zonasOptions = [];
    this.autocompleteSelectComponent.clearSelection();
  }
  
  /**
   * Marca las zonas que ya están en zonasSeleccionadas en la lista listaZonaCorporal
   */
  marcarZonasSeleccionadas(): void {
    if (!this.zonasSeleccionadas || !this.listaZonaCorporal) {
      return;
    }
    
    console.log('Marcando zonas seleccionadas. Total seleccionadas:', this.zonasSeleccionadas.length);
    
    // Recorrer la lista de zonas seleccionadas y marcar las correspondientes en la lista original
    this.zonasSeleccionadas.forEach((zonaSeleccionada: any) => {
      const idZona = zonaSeleccionada.idZonaCorporal || zonaSeleccionada.id;
      
      // Encontrar la zona en la lista original y marcarla como seleccionada
      const indice = this.listaZonaCorporal.findIndex((zona: any) => zona.id === idZona);
      if (indice >= 0) {
        this.listaZonaCorporal[indice].seleccionado = true;
        console.log(`Zona ${this.listaZonaCorporal[indice].descripcion} marcada como seleccionada`);
      }
    });
  }

}


const fake = [
    {
        "id": 2,
        "descripcion": "ABDOMEN HOMBRE",
        "descripcionLarga": null,
        "duracion": 30,
        "detalle": null,
        "igv": 18.00,
        "idGenero": 1,
        "idTipo": 0,
        "genero": "HOMBRE",
        "idEstado": 0,
        "precioBase": 0,
        "precioDescuento": 0,
        "usuarioRegistra": null,
        "usuarioEdita": null,
        "fechaRegistra": "0001-01-01T00:00:00",
        "fechaEdita": "0001-01-01T00:00:00",
        "zonaCorporal": null,
        "subZonas": null,
        "urlWeb": null,
        "imagen": null,
        "zonasRel": null,
        "idServicio": null,
        "idUnidadMedida": null,
        "servicio": null,
        "unidadMedida": null
    },
    {
        "id": 3,
        "descripcion": "ANTEBRAZOS HOMBRE",
        "descripcionLarga": null,
        "duracion": 20,
        "detalle": null,
        "igv": 18.00,
        "idGenero": 1,
        "idTipo": 0,
        "genero": "HOMBRE",
        "idEstado": 0,
        "precioBase": 0,
        "precioDescuento": 0,
        "usuarioRegistra": null,
        "usuarioEdita": null,
        "fechaRegistra": "0001-01-01T00:00:00",
        "fechaEdita": "0001-01-01T00:00:00",
        "zonaCorporal": null,
        "subZonas": null,
        "urlWeb": null,
        "imagen": null,
        "zonasRel": null,
        "idServicio": null,
        "idUnidadMedida": null,
        "servicio": null,
        "unidadMedida": null
    },
    {
        "id": 9,
        "descripcion": "BOZO HOMBRE",
        "descripcionLarga": null,
        "duracion": 10,
        "detalle": null,
        "igv": 18.00,
        "idGenero": 1,
        "idTipo": 0,
        "genero": "HOMBRE",
        "idEstado": 0,
        "precioBase": 0,
        "precioDescuento": 0,
        "usuarioRegistra": null,
        "usuarioEdita": null,
        "fechaRegistra": "0001-01-01T00:00:00",
        "fechaEdita": "0001-01-01T00:00:00",
        "zonaCorporal": null,
        "subZonas": null,
        "urlWeb": null,
        "imagen": null,
        "zonasRel": null,
        "idServicio": null,
        "idUnidadMedida": null,
        "servicio": null,
        "unidadMedida": null
    },
    {
        "id": 10,
        "descripcion": "BRAZOS COMPLETOS HOMBRE",
        "descripcionLarga": null,
        "duracion": 45,
        "detalle": null,
        "igv": 18.00,
        "idGenero": 1,
        "idTipo": 0,
        "genero": "HOMBRE",
        "idEstado": 0,
        "precioBase": 0,
        "precioDescuento": 0,
        "usuarioRegistra": null,
        "usuarioEdita": null,
        "fechaRegistra": "0001-01-01T00:00:00",
        "fechaEdita": "0001-01-01T00:00:00",
        "zonaCorporal": null,
        "subZonas": null,
        "urlWeb": null,
        "imagen": null,
        "zonasRel": null,
        "idServicio": null,
        "idUnidadMedida": null,
        "servicio": null,
        "unidadMedida": null
    }
    
]