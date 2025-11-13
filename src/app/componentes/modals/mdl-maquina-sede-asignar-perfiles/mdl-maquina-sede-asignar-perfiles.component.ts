import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {UtilsService} from '../../../shared/services/funciones/utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MaquinaSedePerfilService} from "../../../shared/services/maquina-sede-perfil.service";
import {PerfilService} from "../../../shared/services/perfil.service";
import {Subscription} from "rxjs";
import {Perfil} from "../../../shared/models";
import {NgSelectConfig} from "@ng-select/ng-select";
import Swal from "sweetalert2";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {MaquinaSedePerfil} from "../../../shared/models/maquina";

@Component({
    selector: 'app-mdl-maquina-sede-asignar-pefiles',
    templateUrl: './mdl-maquina-sede-asignar-perfiles.component.html'
})
export class MdlMaquinaSedeAsignarPerfilesComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() IdMaquinaSede: number;
    @Input() MaquinaSede: any | undefined;
    @Output() OnCreated: EventEmitter<boolean> = new EventEmitter<boolean>();

    submitted = false;
    formGroup: FormGroup;

    // Data listado de perfiles
    ldPerfiles = false;
    sbcPerfiles: Subscription | undefined;
    perfiles: Perfil[] = [];

    // Data formulario
    ldSubmit = false;
    sbcSubmit: Subscription | undefined;

    // Data obtener listado ya asignado
    ldValidarPerfiles = false;
    sbcValidarPerfiles: Subscription | undefined;

    constructor(
        private modal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private utilsService: UtilsService,
        private api: MaquinaSedePerfilService,
        private pefilService: PerfilService,
        private config: NgSelectConfig,
    ) {
      this.config.notFoundText = 'No se encontraron resultados';
    }

    ngOnInit(): void {
      this.formGroup = this.formBuilder.group({
        idPerfiles: new FormControl([])
      });
    }

    ngAfterViewInit(): void {
      this.obtenerPerfiles();
      this.obtenerPerfilesByIdMaquinaSede(this.MaquinaSede?.id);
    }

    ngOnDestroy(): void {
      this.sbcPerfiles?.unsubscribe();
      this.sbcSubmit?.unsubscribe();
      this.sbcValidarPerfiles?.unsubscribe();
    }

    /*******************************************************************************************
     * Getters
     */
    get f(): any { return this.formGroup.controls; }
    get model(): any {
      return {
        idPerfiles: this.f.idPerfiles.value,
        idMaquinaSede: this.MaquinaSede?.id,
        idUsuarioRegistro: this.usuarioService.UsuarioActual.idUsuario
      }
    }
    get loading(): boolean{
      return  this.ldPerfiles ||
              this.ldSubmit ||
              this.ldValidarPerfiles;
    }

    /*******************************************************************************************
     * Events
     */
    evtOnSubmit(): void {
        this.submitted = true;

        if(this.formGroup.invalid || !this.f.idPerfiles.value.length){
          this.utilsService.mostrarToast('Debe seleccionar minimo una opción', 'error');
          return;
        }

        Swal.fire({
          html: `Desea asignar los perfiles a la maquina <b>${this.MaquinaSede.maquina}</b>??`,
          icon: 'question',
          allowOutsideClick: false,
          allowEscapeKey: false,
          buttonsStyling: false,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          showCancelButton: true,
          customClass: {
            popup: 'popins rounded-grant shadow',
            confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
            cancelButton: 'btn sbtn btn-light popins mr-2',
          },
          reverseButtons: true
        }).then(
          result => {
            if(result.isConfirmed) {
              this.ldSubmit = true;

              this.api.registrar(this.model).subscribe((res: boolean | ErrorSistema) => {
                  if (res instanceof ErrorSistema){
                    this.utilsService.mostrarToast(res.message,'error');
                  }else{
                    this.utilsService.mostrarToast(`Se asignaron los perfiles a la maquina <b>${this.MaquinaSede.maquina}</b> con exito`,'success');
                    this.OnCreated.emit(true);
                  }
                  this.ldSubmit = false;
                },
                error => {
                  this.ldSubmit = false;
                  console.log(`Ocurrio  un error al intentar asignar los perfiles a la maquina <b>${this.MaquinaSede.maquina}</b>`, error);
                  this.utilsService.mostrarToast(`Error al registrar asignar los perfiles a la maquina <b>${this.MaquinaSede.maquina}</b>`,'error');
                });
            }
          }
        );
    }

    cerrarModal(): void {
        this.modal.close();
    }

    /*******************************************************************************************
     * Obtener listado de perfiles
     */
    obtenerPerfiles(): void{
      this.ldPerfiles = true;
      this.sbcPerfiles = this.pefilService.obtener().subscribe((res: any[]) => {
        this.perfiles = res.map(x => {
          return new Perfil(
            x.idPerfil,
            x.nombre
          );
        });
        this.perfiles.unshift(new Perfil(
          0,
          'TODOS'
        ))
        this.ldPerfiles = false;
      }, error => {
        this.ldPerfiles = false;
        this.utilsService.mostrarToast('Ocurrio un error al intentar obtener los perfiles', 'error');
      })
    }

  /*******************************************************************************************
   * Obtener listado de perfiles por id maquina sede
   */
  obtenerPerfilesByIdMaquinaSede(idMaquinaSede: number): void{
    this.ldValidarPerfiles = true;
    this.sbcValidarPerfiles = this.api.listarByIdMaquinaSede(this.usuarioService.UsuarioActual.idUsuario, idMaquinaSede).subscribe((res: MaquinaSedePerfil[] | ErrorSistema) => {
      if(res instanceof ErrorSistema){
        this.utilsService.mostrarToast(res.message, 'error');
      }else{
        this.formGroup.patchValue({
          idPerfiles: res.map(x => x.idPerfil)
        })
      }
      this.ldValidarPerfiles = false;
    }, error => {
      this.ldValidarPerfiles = false;
      this.utilsService.mostrarToast('Ocurrio un error al intentar obtener los perfiles asignados a la maquina', 'error');
    })
  }

}
