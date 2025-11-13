import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import {Usuario} from "../../../shared/models";
import {Subscription} from "rxjs";
import {CitaImportClass} from "../../../shared/models/cita";
import {DatePipe} from "@angular/common";
import {CitaAsignadaService} from "../../../shared/services/cita-asignada.service";

@Component({
    selector: 'app-mdl-fecha-cita-asignada',
    templateUrl: 'mdl-fecha-cita-asignada.component.html'
})
export class MdlFechaCitaAsignadaComponent implements OnInit, OnDestroy {

    @Input() cita: CitaImportClass;

    frmGroup: FormGroup;
    accion = '';
    submitted = false;
    usuarioActual: Usuario;
    maquinaDatos: any;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    loading = false;
    subscription : Subscription;



  constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: CitaAsignadaService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private modal: NgbActiveModal,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.initForm();
        if( this.cita){
          this.patchForm();
        }
        console.log(this.cita);
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    initForm(): void {
        this.frmGroup = this.formBuilder.group({
            fecha : new FormControl(null, Validators.required)
        });
    }

    patchForm(): void{
      this.frmGroup.patchValue({
        fecha: this.datePipe.transform(this.cita.fechaConfirmacion, 'yyy-MM-dd')
      })
    }

    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            idCita: this.cita.idCita,
            id: this.cita.idCitaAsignacion,
            fechaAsignacion: this.f.fecha.value,
            idUsuarioRegistra: this.cita.idUsuarioAsignado
        };
    }

    onSubmit(): void {
        this.submitted = true;
        this.loading = true;

        this.spinner.show();
        if (this.frmGroup.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            this.spinner.hide();
            this.loading = false;
            return;
        }

        this.api.cambiarFechaAsignacion(this.model).subscribe((res) => {
          if (res){
            console.log('ok')
            this.modal.close(res);
            this.spinner.hide();
            Swal.fire({
              title: 'La fecha de llamada de la cita asignada fue modificada con exito!!!',
              icon: 'success'
            });
          }
        }, err => {
          console.log(err);
          this.spinner.hide();
        });
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }
}
