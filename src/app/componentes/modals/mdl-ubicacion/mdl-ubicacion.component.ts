import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Subscription} from "rxjs";
import {UbicacionService} from "../../../shared/services/ubicacion.service";
import {UCiudad, UDepartamento, UDistrito} from "../../../shared/models/ubicacion";
import {UtilsService} from "../../../shared/services/funciones/utils.service";

@Component({
    selector: 'app-mdl-ubicacion',
    templateUrl: 'mdl-ubicacion.component.html'
})
export class MdlUbicacionComponent implements OnInit, OnDestroy {

    @Input() data: { idUbicacion: string | null, direccion: string | null } | null = null;
    @Output() ubigeo: EventEmitter<{
      idUbicacion: string | null,
      direccion: string | null,
      departamento: string | null,
      ciudad: string | null,
      distrito: string | null,
    }> = new EventEmitter();

    frmGroup: FormGroup;
    submitted = false;

    loading = false;
    subscription : Subscription;

    departamentos: UDepartamento[] = [];
    ciudades: UCiudad[] = [];
    distritos: UDistrito[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private modal: NgbActiveModal,
        private ubicacionService: UbicacionService,
        private utilService: UtilsService
    ) {

    }

    ngOnInit(): void {
        this.departamentoCollection();

        this.initForm();

        this.frmGroup.get('idDepartamento').valueChanges.subscribe(res => {

          this.f.idCiudad.patchValue('');
          this.f.idDistrito.patchValue('');
          this.distritos = [];
          if(res){
            this.ciudadesCollectionByDepartamento(res);
            this.f.idCiudad.setValidators(Validators.required);
          }else{
            this.f.idCiudad.clearValidators();
            this.f.idDistrito.clearValidators();

            this.ciudades = [];
          }
          this.f.idCiudad.updateValueAndValidity();
          this.f.idDistrito.updateValueAndValidity();
        });
      this.frmGroup.get('idCiudad').valueChanges.subscribe(res => {
        this.f.idDistrito.patchValue('');
        if(res){
          this.distritoCollectionByDepartamentoAndCiudad(this.f.idDepartamento.value, res);
          this.f.idDistrito.setValidators(Validators.required);
        }else{
          this.f.idDistrito.clearValidators();

          this.distritos = [];
        }
        this.f.idDistrito.updateValueAndValidity();
      });

      if( this.data) {
        this.patchForm();
      }
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    initForm(): void {
        this.frmGroup = this.formBuilder.group({
            idDepartamento : new FormControl(''),
            idCiudad : new FormControl(''),
            idDistrito : new FormControl(''),
            direccion : new FormControl('', Validators.required)
        });
    }

    patchForm(): void{
      const ubicacion = this.data.idUbicacion;

      this.frmGroup.patchValue({
        idDepartamento : ubicacion.length ? ubicacion.substring(0,2) : '',
        idCiudad : ubicacion.length ? ubicacion.substring(2,4) : '',
        idDistrito : ubicacion.length ? ubicacion : '',
        direccion : this.data.direccion
      });
      // console.log(
      //   ubicacion.substring(0,2),
      //   ubicacion.substring(2,4),
      //   ubicacion.substring(4,6)
      // );
      // this.f.idDepartamento.patchValue(ubicacion.length ? ubicacion.substring(0,2) : '');
    }

    get f(): any { return this.frmGroup.controls; }
    // get model(): any {
    //     return {
    //         id: this.data ? this.data.id : 0,
    //         nombre: this.f.nombre.value,
    //         nombreCorto: this.f.nombreCorto.value,
    //         color: this.f.color.value,
    //         idEstado: parseInt(this.f.idEstado.value, 10),
    //         idUsuarioRegistro: this.data ? this.data.idUsuarioRegistro : this.usuarioActual.idUsuario,
    //         idUsuarioModifico: this.data ? this.usuarioActual.idUsuario : null,
    //     };
    // }

    onSubmit(): void {
        this.submitted = true;

        if (this.frmGroup.invalid) {
            this.utilService.mostrarToast('Datos incompletos!!!', 'info');
            return;
        }

        this.ubigeo.emit({
          idUbicacion: this.f.idDistrito.value ? this.f.idDistrito.value : null,
          departamento: this.f.idDepartamento.value ? this.departamentos.find(x => x.id === this.f.idDepartamento.value)?.nombre : null,
          ciudad: this.f.idCiudad.value ? this.ciudades.find(x => x.id === this.f.idCiudad.value)?.nombre : null,
          distrito: this.f.idDistrito.value ? this.distritos.find(x => x.id === this.f.idDistrito.value)?.nombre : null,
          direccion: this.f.direccion.value
        });

        this.cerrarModal(true);
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

    // data
    departamentoCollection(): void{
      this.ubicacionService.obtenerDepartamento().subscribe((res: any[]) => {
        // console.log(res);
        this.departamentos = res.map((x: any) => {
          const dep = new UDepartamento();
          dep.id = x.idDepartamento;
          dep.nombre = x.departamento;
          return dep;
        });
      }, error => {
        console.log(error)
      });
    }

    ciudadesCollectionByDepartamento(idDepartamento: string): void{
      this.ubicacionService.obtenerCiudadByToDepartamento(idDepartamento).subscribe((res: any[]) => {
        // console.log(res);
        this.ciudades = res.map((x: any) => {
          const c = new UCiudad();
          c.id = x.idCiuda;
          c.nombre = x.ciudad;
          return c;
        });
      }, error => {
        console.log(error)
      });
    }

  distritoCollectionByDepartamentoAndCiudad(idDepartamento: string, idCiudad: string): void{
    this.ubicacionService.obtenerDistritoByToCiudadByToDepartamento(idCiudad, idDepartamento).subscribe((res: any[]) => {
      // console.log(res);
      this.distritos = res.map((x: any) => {
        const dep = new UDistrito();
        dep.id = x.idUbicacion;
        dep.nombre = x.distrito;
        return dep;
      });
    }, error => {
      console.log(error)
    });
  }
}
