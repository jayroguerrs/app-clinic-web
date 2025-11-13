import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalConstants} from "../../../commons/global-constants";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthService} from "../../shared/services/auth.service";
import {UsuarioService} from "../../shared/services/usuario.service";
import {Observable, Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TipoEventoSignalR} from "../../shared/enumeracion/enums";
import { AutocompleteOption, AutocompleteConfig, AutocompleteSelectionEvent } from '../../shared/components/autocomplete-select/autocomplete-select.interface';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit, AfterViewInit, OnDestroy {

  rutaImageSpinner = GlobalConstants.gIconoSpinner;

  usuarios: any = [];
  usuarioOptions: AutocompleteOption[] = [];
  sbcCollectionUsuarios?: Subscription;

  // Controles para autocomplete
  usuarioControl1 = new FormControl(null);
  usuarioControl2 = new FormControl(null);
  
  // Configuraciones para el autocomplete
  usuarioAutocompleteConfig: AutocompleteConfig = {
    label: 'Seleccionar usuario',
    placeholder: 'Buscar usuario o seleccionar TODOS...',
    prefixIcon: 'person_search',
    clearable: true,
    searchable: true,
    appearance: 'outline',
    width: '100%'
  };
  
  // Usuarios seleccionados actuales
  usuarioSeleccionado1: AutocompleteOption | null = null;
  usuarioSeleccionado2: AutocompleteOption | null = null;

  frmGroup1: FormGroup;
  frmGroup2: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private frmBuilder: FormBuilder
  ) {
    this.frmGroup1 = this.frmBuilder.group({
      idUsuario: new FormControl('0')
    });
    this.frmGroup2 = this.frmBuilder.group({
      idUsuario: new FormControl('0')
    });

  }

  ngOnInit(): void {
    this.usuarioListar();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.sbcCollectionUsuarios?.unsubscribe();
  }

  actualizarSistema(): void{
    if (!this.usuarioSeleccionado2) return;
    
    const idUsuario = typeof this.usuarioSeleccionado2.id === 'string' 
      ? parseInt(this.usuarioSeleccionado2.id, 10)
      : this.usuarioSeleccionado2.id;
    GlobalConstants.gSignalService.enviarEvento(TipoEventoSignalR.ActualizarSistema, idUsuario, this.auth.getUser().id).subscribe(
      res => {
        console.log('Sistema actualizado para usuario:', this.usuarioSeleccionado2?.text);
        console.log(res);
      }
    );
  }

  cerrarSesion(): void{
    if (!this.usuarioSeleccionado1) return;
    
    const idUsuario = typeof this.usuarioSeleccionado1.id === 'string' 
      ? parseInt(this.usuarioSeleccionado1.id, 10)
      : this.usuarioSeleccionado1.id;
    GlobalConstants.gSignalService.enviarEvento(TipoEventoSignalR.CerrarSesion, idUsuario, this.auth.getUser().id).subscribe(
      res => {
        console.log('Sesión cerrada para usuario:', this.usuarioSeleccionado1?.text);
        console.log(res);
      }
    );
  }

  // Data
  usuarioListar(): void {
    this.sbcCollectionUsuarios = this.usuarioService.obtenerUsuarios(true).subscribe(
      resultado => {
        console.log('Usuarios obtenidos:', resultado);
        this.usuarios = resultado;
        this.convertirUsuariosAOpciones();
      },
      error => console.log('Error al obtener los usuario', error)
    );
  }

  // Convertir usuarios a formato AutocompleteOption
  convertirUsuariosAOpciones(): void {
    // Primero agregar opción "TODOS"
    this.usuarioOptions = [{
      id: '0',
      text: '...TODOS...',
      icon: 'group'
    }];

    // Luego agregar los usuarios del servicio
    if (this.usuarios && this.usuarios.length > 0) {
      const usuariosFormateados = this.usuarios.map((usuario: any) => ({
        id: usuario.idUsuario?.toString() || usuario.id?.toString(),
        text: usuario.nombre || usuario.text,
        icon: 'person'
      }));
      
      this.usuarioOptions = [...this.usuarioOptions, ...usuariosFormateados];
    }
    
    console.log('Opciones de autocomplete creadas:', this.usuarioOptions);
  }

  // Event handlers para selecciones
  onUsuario1Selected(event: AutocompleteSelectionEvent): void {
    this.usuarioSeleccionado1 = event.option;
    if (this.usuarioSeleccionado1) {
      this.frmGroup1.patchValue({ idUsuario: this.usuarioSeleccionado1.id });
    }
  }

  onUsuario2Selected(event: AutocompleteSelectionEvent): void {
    this.usuarioSeleccionado2 = event.option;
    if (this.usuarioSeleccionado2) {
      this.frmGroup2.patchValue({ idUsuario: this.usuarioSeleccionado2.id });
    }
  }

}
