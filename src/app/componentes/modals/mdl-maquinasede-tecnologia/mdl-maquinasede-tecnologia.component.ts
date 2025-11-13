import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Subscription} from "rxjs";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {TecnologiaService} from "../../../shared/services/tecnologia.service";
import {Tecnologia} from "../../../shared/models/tecnologia";
import {MaquinaSedeTecnologiaService} from "../../../shared/services/corporal360/maquina-sede-tecnologia.service";
import {MaquinaSede360Service} from "../../../shared/services/corporal360/maquina-sede360.service";

@Component({
    selector: 'app-mdl-maquinasede-tecnologia',
    templateUrl: 'mdl-maquinasede-tecnologia.component.html'
})
export class MdlMaquinasedeTecnologiaComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() IdMaquinaSede: number = 0;
    @Input() IdServicio: number = 0;
    @Output() OnCreate = new EventEmitter<boolean>();

    submitted = false;
    maquinaDatos: any;

    loading = false;
    subscription : Subscription;

    tecnologiasSelected: Tecnologia[] = [];
    tecnologias: Tecnologia[] = [];
    sbTecnologias: Subscription;
    sbTecnologiasSelected: Subscription;

    ldTecnologias = false;
    ldTecnologiasSelected = false;

    idTecnologia = new FormControl('', Validators.required);


    constructor(
        private usuarioService: UsuarioService,
        private tecnologiaService: TecnologiaService,
        private api: MaquinaSede360Service,
        private utilsService: UtilsService,
        private modal: NgbActiveModal
    ) {

    }

    ngOnInit(): void {
        if( this.IdMaquinaSede) {
          // this.patchForm();
        }
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
      this.sbTecnologias?.unsubscribe();
    }

    ngAfterViewInit(): void
    {
      this.listarTecnologias();
      this.listarTecnologiasByMaquina();
    }


    get model(): any {
        return {
            idMaquinaSede: this.IdMaquinaSede,
            idUsuarioRegistro: this.usuarioService.UsuarioActual.idUsuario,
            tecnologias: this.tecnologiasSelected.map(x => new Object({ idServicio: this.IdServicio, id: x.id }) )
        };
    }

    onSubmit(): void {
        if(!this.tecnologiasSelected.length){return;}
        this.submitted = true;
        this.loading = true;

      Swal.fire({
        title: 'Desea asigar las tecnologias a la maquina??',
        icon: 'question',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        showCancelButton: true
      }).then(
        result => {
          if(result.isConfirmed) {
            this.loading = true;
            this.api.asignarTecnologias(this.IdMaquinaSede, this.model).subscribe((res: boolean | ErrorSistema) => {
                if (res instanceof ErrorSistema){

                  Swal.fire({
                    title: 'Error',
                    text: res.message,
                    icon: 'error',
                    buttonsStyling: false,
                    confirmButtonText: 'Aceptar',
                    customClass: {
                      confirmButton: 'btn btn-primary'
                    }
                  });

                  this.loading = false;
                }else{
                  Swal.fire({
                    text: "Se asignaron las tecnologías al apartado maquina sede con exito!!!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Aceptar",
                    customClass: {
                      confirmButton: "btn btn-primary"
                    }
                  });
                  this.OnCreate.emit(true);
                  this.loading = false;
                  this.cerrarModal(true);
                }
              },
              error => {
                this.loading = false;
                console.log('Error al intentar asignar las tecnologías', error);
                Swal.fire({
                  title: 'Error',
                  text: 'Error al intentar asignar las tecnologías',
                  icon: 'error',
                  buttonsStyling: false,
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    confirmButton: 'btn btn-primary'
                  }
                });
              });
          }
        }
      );
    }

    select(): void{
      if(!this.idTecnologia.value){return}

      console.log('d');
      this.tecnologiasSelected.push(this.tecnologias.find(x => x.id === parseInt(this.idTecnologia.value, 10)));
    }
    remove(index: number): void{
      this.tecnologiasSelected = this.tecnologiasSelected.filter((x, i) => i !== index);
    }

    isSelect(tecnologia: Tecnologia): boolean{
      return !!this.tecnologiasSelected.find(x => x.id === tecnologia.id);
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

    // data
    listarTecnologias(): void{
      this.ldTecnologias = true;
      this.sbTecnologias = this.tecnologiaService.listarByServicio(this.IdServicio).subscribe((res: Tecnologia[]) => {
        this.tecnologias = res;
        this.ldTecnologias = false;
      }, error => {
        console.log(error);
        this.ldTecnologias = false;
      })
    }
    listarTecnologiasByMaquina(): void{
      this.ldTecnologias = true;
      this.sbTecnologiasSelected = this.api.listarTecnologias(this.IdMaquinaSede).subscribe((res: Tecnologia[]) => {
        this.tecnologiasSelected = res;
        this.ldTecnologias = false;
      }, error => {
        console.log(error);
        this.ldTecnologias = false;
      })
    }


}
