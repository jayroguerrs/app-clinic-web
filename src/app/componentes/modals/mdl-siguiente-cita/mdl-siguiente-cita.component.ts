import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthService} from "../../../shared/services/auth.service";
import {CitaService} from "../../../shared/services/cita.service";
import {AccionCita} from "../../../shared/enumeracion/enums";
import {ErrorSistema} from "../../../shared/models/error-sistema";
@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-siguiente-cita.component.html',
  styleUrls: ['./mdl-siguiente-cita.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlSiguienteCitaComponent implements OnInit, AfterViewInit {
  @Input() IdCita!: number;
  @Input() IdCliente!: number;

  subscription: Subscription | undefined;
  ldSubmit = false;
  submitted = false;

  frmGroup: FormGroup;
  accionCita = AccionCita;


  numeroMeses : {value: number, text: string}[] = [
    {value: 1, text: 'Un mes'},
    {value: 1.5, text: 'Un mes y medio'},
    {value: 2, text: 'Dos meses'},
    {value: 3, text: 'Tres meses'},
    {value: 4, text: 'Cuatro meses'},
  ]

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modal: NgbActiveModal,
    public auth: AuthService,
    private api: CitaService
  ) {
    this.frmGroup = this.formBuilder.group({
      numeroMeses: new FormControl(1, Validators.required)
    });
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  cerrarModal(): void{
    this.modal.close();
  }

  onSubmit(): void{
    Swal.fire({
      title: 'Agendar siguiente cita',
      html: `¿Desea agendar la siguiente cita dentro de <b>${this.numeroMeses.find(x => x.value === Number(this.f.numeroMeses.value))?.text}</b>?`,
      icon: 'question',
      buttonsStyling: false,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
        cancelButton: 'btn sbtn btn-light popins mr-2',
      },
      reverseButtons: true
    }).then( async (result) => {
      if (result.value) {
        this.submitted = true;
        this.ldSubmit = true;

        this.subscription = this.api.AgendarSiguienteCita(this.model).subscribe((res: number | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            Swal.fire({
              title: 'Error',
              text: `${res.message}`,
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Aceptar',
              showCancelButton: false,
              customClass: {
                confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
                cancelButton: 'btn sbtn btn-light popins mr-2',
              },
              reverseButtons: true
            });
          }else{

            Swal.fire({
              text: `Se registro con exito la siguiente cita`,
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Aceptar',
              showCancelButton: false,
              customClass: {
                confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
                cancelButton: 'btn sbtn btn-light popins mr-2',
              },
              reverseButtons: true
            }).then( async (result) => {
            });

            this.cerrarModal();

            this.router.navigate([`/Cita/${res}/${this.accionCita.EDITAR}/${this.IdCliente}/0`]);
          }
          this.ldSubmit = false;
        }, (error: any) => {
          console.log(error);
          this.ldSubmit = false;
        });

      }
    });
  }

  get f(): any{
    return this.frmGroup.controls;
  }

  get model(): any{
    return {
      numeroMeses: Number(this.f.numeroMeses.value), // Esto garantiza que siempre sea Float
      idCita: this.IdCita,
      idUsuarioRegistro: this.auth.getUser()?.id
    }
  }

}
