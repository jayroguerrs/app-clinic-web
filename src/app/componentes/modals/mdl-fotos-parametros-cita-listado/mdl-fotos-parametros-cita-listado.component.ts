import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MdlFotosParametrosCitaComponent } from '../mdl-fotos-parametros-cita/mdl-fotos-parametros-cita.component';
import { NestjsUploadFilesService } from '../../../shared/services/nestjs-upload-files.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mdl-fotos-parametros-cita-listado',
  templateUrl: './mdl-fotos-parametros-cita-listado.component.html',
  styleUrls: ['./mdl-fotos-parametros-cita-listado.component.scss']
})
export class MdlFotosParametrosCitaListadoComponent implements OnInit {
  @Input() nroSesion: number = 0;
  @Input() modal: NgbModalRef;

  @Input() clienteId: number;
  @Input() servicioId: number;
  @Input() zonaId: number;
  @Input() sesion: number;

  
  imagenSeleccionada: string | null = null;
  imagenesTomadas: string[] = [];

  modalRef: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private nestjsUploadFilesService: NestjsUploadFilesService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.obtenerListado();
  }

  obtenerListado(){
    this.spinner.show();
    this.nestjsUploadFilesService.getImageParametros(this.clienteId, this.servicioId, this.zonaId, this.sesion).subscribe((data: any) => {
      this.imagenesTomadas = data;

      this.spinner.hide();
    })
  }

  cerrarModal(output: boolean = false): void {
    this.modal.close(output);
  }
  
  abrirImagen(img: string) {
    this.imagenSeleccionada = img;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  agregarFoto(){
    this.modalRef = this.modalService.open(MdlFotosParametrosCitaComponent, { size: 'md', windowClass: 'bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.modalRef.componentInstance.modal = this.modalRef;

    this.modalRef.componentInstance.clienteId = this.clienteId;
    this.modalRef.componentInstance.servicioId = this.servicioId;
    this.modalRef.componentInstance.zonaId = this.zonaId;

    this.modalRef.componentInstance.listarImgs.subscribe(() => {
      this.obtenerListado();
    });
  }

  eliminarImg(index: number, imgUrl: string){
    Swal.fire({
      title: "¿Estas seguro de eliminar la foto?",
      
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminalo!",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const imgName = imgUrl.split('/').pop();
    
        if(imgName) {
          this.nestjsUploadFilesService.deleteImageParametro(imgName).subscribe((resp : any) => {
            if(resp.deleted){
              this.obtenerListado();
            }
          })
        }
      }
    });

  }
}
