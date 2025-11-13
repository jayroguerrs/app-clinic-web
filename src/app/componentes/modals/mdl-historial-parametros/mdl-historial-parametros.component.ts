import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CitaService } from '../../../shared/services/cita.service';
import { MdlFotosParametrosCitaListadoComponent } from '../mdl-fotos-parametros-cita-listado/mdl-fotos-parametros-cita-listado.component';

@Component({
  selector: 'app-mdl-historial-parametros',
  templateUrl: './mdl-historial-parametros.component.html',
  styleUrls: ['./mdl-historial-parametros.component.scss']
})
export class MdlHistorialParametrosComponent implements OnInit {
  @Input() modal: NgbModalRef;

  @Input() idServicio: number;
  @Input() idCliente: number;
  @Input() idZona: number;
  @Input() maquinaMarca: string = '';
  @Input() idDetalle: number;
  @Input() sesion: number;

  modalRef: NgbModalRef | undefined;

  
  listHistorialParametros: any[] = [];
  constructor(
    private citaService: CitaService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.citaService.obtenerHistorialParametros(this.idCliente, this.idServicio, this.idZona).subscribe((res: any) => {
      this.listHistorialParametros = res;
    })
  }

  cerrarModal(output: boolean = false): void {
    this.modal.close(output);
  }

  abrirMdlFotosListado(sesion: number) {
    this.modalRef = this.modalService.open(MdlFotosParametrosCitaListadoComponent, { size: 'md', windowClass: 'bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.modalRef.componentInstance.modal = this.modalRef;
    this.modalRef.componentInstance.nroSesion = sesion;
    this.modalRef.componentInstance.servicioId = this.idServicio;
    this.modalRef.componentInstance.clienteId = this.idCliente;
    this.modalRef.componentInstance.zonaId = this.idZona;
    this.modalRef.componentInstance.sesion = sesion;
  }
}
