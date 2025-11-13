import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MdlFotosParametrosCitaComponent } from '../mdl-fotos-parametros-cita/mdl-fotos-parametros-cita.component';
import { MaquinaMarca } from '../../../shared/models/maquina-marca';

@Component({
  selector: 'app-mdl-parametros-cita-registro',
  templateUrl: './mdl-parametros-cita-registro.component.html',
  styleUrls: ['./mdl-parametros-cita-registro.component.scss']
})
export class MdlParametrosCitaRegistroComponent implements OnInit {

  @Input() nroSesion: number = 0;
  @Input() modal: NgbModalRef;
  @Input() maquinaMarcas: MaquinaMarca[] = [];
  
  
  imagenSeleccionada: string | null = null;
  imagenesTomadas: string[] = [];

  modalRef: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,    
  ) { }

  ngOnInit(): void {
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
  }
}
