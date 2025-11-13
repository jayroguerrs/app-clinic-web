import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-ver-clave.component.html',
  styleUrls: ['./mdl-ver-clave.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlVerClaveComponent implements OnInit, AfterViewInit {
  @Input() IdUsuario!: number;

  subscription: Subscription | undefined;
  ldSubmit = false;
  submitted = false;

  clave: string = null;

  constructor(
    private router: Router,
    public modal: NgbActiveModal,
    public auth: AuthService,
    private api: UsuarioService
  ) {
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getPassword();
  }

  cerrarModal(): void{
    this.modal.close();
  }

  getPassword(): void{
    this.ldSubmit = true;
    this.subscription = this.api.ObtenerClave(this.IdUsuario).subscribe((res: string | ErrorSistema) => {
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

        this.clave = res;
      }
      this.ldSubmit = false;
    }, (error: any) => {
      console.log(error);
      this.ldSubmit = false;
    });
  }

}
