import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { ConfirmarUsuario, Usuario } from '../../../shared/models/usuario';
import { IntentosConfirmarSupervisorService } from '../../../shared/services/intentos-confirmar-supervisor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Observable, ReplaySubject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { AutocompleteOption } from '../../../shared/components/autocomplete-select';

@Component({
  selector: 'app-mdl-confirmar-supervisor',
  templateUrl: './mdl-confirmar-supervisor.component.html',
  styleUrls: ['./mdl-confirmar-supervisor.component.scss', './material-modal-fixes.scss'],
  encapsulation: ViewEncapsulation.None // Importante para que los estilos aplicados al panel sean globales
})
export class MdlConfirmarSupervisorComponent implements OnInit, AfterViewInit {
  @Input() modal!: NgbModalRef;
  frmUserDatos!: FormGroup;
  
  private aprobacionVerificada = new ReplaySubject<boolean>(1);

  usuarioActual!: Usuario;
  
  aprobado: number = 0;
  @Input() estadoAprobacionUsuarioActual: number = 0;
  
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  
  @ViewChild('solicitudEnviadaModal') modalSolicitudEnviadaModal!: NgbModalRef;

  // Variables para el autocomplete
  supervisores: any[] = [];
  filteredSupervisores: Observable<any[]> = of([]);
  searchControl = new FormControl();
    
  constructor(
    private formBuilder: FormBuilder,
    private intentosConfirmarSupervisorService: IntentosConfirmarSupervisorService,
    private usuarioService: UsuarioService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngAfterViewInit(): void {
    // Asegurar que el panel de opciones del autocomplete se muestre por encima del modal
    this.fixAutocompleteZIndex();

  }
  
  // Función para corregir el z-index del panel de autocompletado
  private fixAutocompleteZIndex(): void {
    // Esta función se asegura de que el panel de autocompletado se muestre sobre el modal
    Promise.resolve().then(() => {
      const panels = document.querySelectorAll('.mat-autocomplete-panel');
      panels.forEach(panel => {
        (panel as HTMLElement).style.zIndex = '1100';
        (panel as HTMLElement).style.pointerEvents = 'auto';
      });
      try { this.cd.detectChanges(); } catch (e) { /* ignore */ }
    });
  }


  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.frmUserDatos = this.formBuilder.group({
      idSupervisor: ['', Validators.required]
    });
    // Cargar la lista de supervisores
    this.cargarSupervisores();
    
    // Configurar el filtrado de supervisores
    this.filteredSupervisores = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(val => this.filtrarSupervisores(val))
    );
  }

  // Método para cargar supervisores
  cargarSupervisores() {
    this.spinner.show();
    
    this.usuarioService.obtenerSupervisores().subscribe(
      (resp: any) => {
        console.log('Respuesta de supervisores:', resp);
        
        // Intentar determinar la estructura correcta de la respuesta
        if (resp && resp.data && Array.isArray(resp.data)) {
          this.supervisores = resp.data;
        } else if (Array.isArray(resp)) {
          this.supervisores = resp;
        } else if (resp && typeof resp === 'object') {
          // Si es un objeto que no tiene data, verificamos si el objeto mismo contiene los supervisores
          this.supervisores = [resp]; 
        } else {
          console.error('Formato de respuesta no reconocido:', resp);
          this.supervisores = [];
        }
        
        // Mapear los datos si tienen formato diferente
        this.supervisores = this.supervisores.map(sup => {
          return {
            id: sup.id || sup.idUsuario || sup.idSupervisor || 0,
            nombre: sup.nombre || sup.nombreCompleto || sup.name || '',
            usuario: sup.usuario || sup.user || sup.username || ''
          };
        });
        
        // Actualizar la UI en microtarea para evitar cambios durante la detección
        Promise.resolve().then(() => {
          this.spinner.hide();
          const currentValue = this.searchControl.value;
          this.searchControl.setValue(currentValue || '', {emitEvent: true});
          console.log('Supervisores disponibles para filtrado:', this.supervisores.length);
          try { this.cd.detectChanges(); } catch (e) { /* ignore */ }
        });
      },
      error => {
        console.error('Error al obtener supervisores:', error);
        this.spinner.hide();
        
        // Cargar datos de ejemplo en caso de error
        this.supervisores = [
          { id: 1, nombre: 'Supervisor 1 (Demo)', usuario: 'super1' },
          { id: 2, nombre: 'Supervisor 2 (Demo)', usuario: 'super2' },
          { id: 3, nombre: 'Supervisor 3 (Demo)', usuario: 'super3' }
        ];
        this.filteredSupervisores = of(this.supervisores);
        this.searchControl.updateValueAndValidity();
        
        // Mostrar mensaje de error
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los supervisores. Se cargaron datos de ejemplo.',
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
      }
    );

  }
  
  // Método para filtrar supervisores según el texto ingresado
  filtrarSupervisores(val: string | any): Observable<any[]> {
    console.log('Filtrando con valor:', val, 'tipo:', typeof val);
    
    // Si el valor es un objeto (ya seleccionado), devolvemos ese supervisor
    if (val && typeof val === 'object') {
      console.log('Devolviendo objeto seleccionado:', val);
      return of([val]);
    }
    
    // Si no hay valor o es cadena vacía, devuelve todos los supervisores
    if (!val || val === '') {
      console.log('Devolviendo todos los supervisores:', this.supervisores.length);
      return of(this.supervisores);
    }
    
    // Filtra los supervisores según el texto ingresado
    const filterValue = val.toString().toLowerCase().trim();
    console.log('Buscando texto:', filterValue);
    
    const filteredResults = this.supervisores.filter(supervisor => {
      // Obtenemos todos los posibles valores para comparar
      const nombre = (supervisor.nombre || supervisor.nombreCompleto || supervisor.name || '').toString().toLowerCase();
      const usuario = (supervisor.usuario || supervisor.user || supervisor.username || '').toString().toLowerCase();
      const id = (supervisor.id || supervisor.idUsuario || '').toString().toLowerCase();
      
      // Verificamos coincidencias
      const nombreMatch = nombre.includes(filterValue);
      const usuarioMatch = usuario.includes(filterValue);
      const idMatch = id.includes(filterValue);
      
      const matches = nombreMatch || usuarioMatch || idMatch;
      
      if (matches) {
        console.log('Coincidencia encontrada:', supervisor);
      }
      
      return matches;
    });
    
    console.log('Resultados filtrados:', filteredResults.length);
    return of(filteredResults);
  }
  
seleccionarSupervisor(supervisor: any): void {
  console.log('Supervisor seleccionado:', supervisor);

  if (!supervisor) return;

  const usuarioValue = supervisor.usuario || supervisor.user || supervisor.username || '';

  if (!usuarioValue) {
    console.error('El supervisor seleccionado no tiene usuario válido:', supervisor);
    return;
  }

  // ✅ Ejecutamos el cambio fuera del ciclo actual
  this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.frmUserDatos.patchValue({ idSupervisor: usuarioValue });
        this.frmUserDatos.get('idSupervisor')?.markAsTouched();
        this.searchControl.setValue(supervisor, { emitEvent: false });
      });
    }, 0);
  });
}


  
  // Método para mostrar el texto en el autocomplete
  displayFn = (supervisor: any): string => {
    if (!supervisor) return '';
    
    // Intentar diferentes propiedades para el nombre
    const nombre = supervisor.nombre || supervisor.nombreCompleto || supervisor.name || '';
    const usuario = supervisor.usuario || supervisor.user || supervisor.username || '';
    
    // Si tenemos ambos, mostrarlos juntos, si no, mostrar el que tengamos
    if (nombre && usuario) {
      return `${nombre} (${usuario})`;
    } else if (nombre) {
      return nombre;
    } else if (usuario) {
      return usuario;
    }
    
    return '';
  }

  /**
   * Manejo de eventos de entrada de texto para depuración de filtrado
   * @param event Evento de input
   */
  onInputChange(event: any): void {
    // Realizar filtrado manual para depuración
    const value = event.target.value.toLowerCase();
    const filtered = this.supervisores.filter(
      s => (s.nombre || '').toString().toLowerCase().includes(value) || 
           (s.usuario || '').toString().toLowerCase().includes(value)
    );
    console.log(`Filtro manual: "${value}" - ${filtered.length} resultados:`, filtered);
  }

  cerrarModal(): void {
    this.modal.close();
  }

  private mdlSolicitudEnviada: NgbModalRef | undefined;

  // Método para mostrar modal de solicitud enviada
  mostrarModalSolicitudEnviada(modalTemplate: any): void {
    this.mdlSolicitudEnviada = this.modalService.open(modalTemplate, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
  }


  supervisorSubmit(){
    this.spinner.show();

    const model = new ConfirmarUsuario();
    model.idUsuario = this.usuarioActual.idUsuario;
    model.usuarioSupervisor = this.frmUserDatos.value.idSupervisor;

    this.usuarioService.confirmarSupervisor(model).subscribe(
      response => {
        if (response.status === 200) {
          // Small UX delay but done with promise to keep flow predictable
          this.delayThenExecute(1000).then(() => {
            const userKeyData = localStorage.getItem('usersKey');
            const userData = userKeyData ? JSON.parse(userKeyData) : {};
            userData.idSupervisor = response.data.idSupervisor;
            this.aprobado = 3;
            this.estadoAprobacionUsuarioActual = 3;

            localStorage.setItem('usersKey', JSON.stringify(userData));
            this.usuarioActual.idSupervisor = response.data.idSupervisor;
            this.usuarioService.actualizarUsuarioActual(this.usuarioActual);

            this.spinner.hide();
            // this.mostrarModalSolicitudEnviada(this.modalSolicitudEnviadaModal);
            this.cerrarModal();
            window.location.reload();

          });
        }

      },
      error => {
        Swal.fire({
          title: 'Error al enviar',
          text: 'No se pudo confirmar el usuario de supervisor',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3085d6'
        });
        console.error('Error al confirmar supervisor:', error);
        this.spinner.hide();
      }
    );
  }

  usuarioOptions: AutocompleteOption[] = [];
  
  // Helper para crear una promesa que se resuelve después de ms milisegundos
  private delayThenExecute(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }
  
  
}
