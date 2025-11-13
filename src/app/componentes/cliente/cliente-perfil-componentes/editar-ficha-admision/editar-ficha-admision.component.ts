import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FichaAdmisionService} from "../../../../shared/services/ficha-admision.service";
import {FA_Patologia, FichaAdmision} from "../../../../shared/models/ficha-admision";
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-ficha-admision',
  templateUrl: './editar-ficha-admision.component.html',
  styleUrls: ['./editar-ficha-admision.component.scss']
})
export class EditarFichaAdmisionComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() IdFichaAdmision: number = 0;

  patologias: FA_Patologia[] = [];
  sbcPatologias: Subscription;
  sbcEditarFicha: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private fichaService: FichaAdmisionService,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.fichaService.obtenerById(this.IdFichaAdmision).subscribe((res) => {
      if(res){
        this.patologias = res.patologias;
      }
    }, error => {
      console.log(error);
    });
  }

  ngOnDestroy(): void {
    if(this.sbcPatologias){ this.sbcPatologias.unsubscribe()}
    if(this.sbcEditarFicha){ this.sbcEditarFicha.unsubscribe()}
  }

  ngAfterViewInit(): void {
  }

  close(): void{
    this.activeModal.close();
  }

  activarPatologia(event, idPatologia): void{
    this.patologias.forEach((p,i) => {
      if( p.id === idPatologia ){
        p.activo = event.target.checked;
      }
    });
  }

  onSubmit():void {
    const patologias: FA_Patologia[] = this.patologias.filter( p => p.activo === true);
    const ficha = new FichaAdmision();
    ficha.id = this.IdFichaAdmision;
    ficha.patologias = patologias;
    ficha.idUsuarioEdita = this.usuarioService.UsuarioActual.idUsuario;

    this.spinnerService.show()
    this.sbcEditarFicha = this.fichaService.editarFicha(ficha).subscribe((res) => {

        Swal.fire({
          title: 'Editar ficha clínica',
          html: 'Se modificó con exito la Ficha #' + this.IdFichaAdmision.toString().padStart(8,'0'),
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: true,
          confirmButtonText: 'Ok'
        });

      this.close();
      this.spinnerService.hide();
    }, error => {

      Swal.fire({
        title: 'Editar ficha clínica',
        html: 'Ocurrio un error al intentar modificar la Ficha #' + this.IdFichaAdmision.toString().padStart(8,'0'),
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        confirmButtonText: 'Ok'
      });

      console.log(error);
      this.spinnerService.hide();
    });
  }

}
