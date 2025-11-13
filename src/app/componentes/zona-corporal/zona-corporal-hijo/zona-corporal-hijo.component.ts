import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { ZonaCorporalService } from '../../../shared/services/zona-corporal.service';

@Component({
  selector: 'app-zona-corporal-hijo',
  templateUrl: './zona-corporal-hijo.component.html',
  styleUrls: ['./zona-corporal-hijo.component.scss']
})
export class ZonaCorporalHijoComponent {
  @Input() modal: NgbModalRef;
  zonaPadre = 'Facial';
  frmZonaCorporalHijo: FormGroup;
  idZonaCorporalPadre = 0;
  accion = '';
  usuarioActual: Usuario;
  listaZonaCorporalHijos: any = [];
  listaMZonasCorporalesPorGenero: any = [];

  constructor(
    private utilsService: UtilsService,
    private zonaCorporalService: ZonaCorporalService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) { }
  inicializarFormulario(): void {
    this.frmZonaCorporalHijo = this.formBuilder.group({
      cboZonaCorporalPorGenero: [''],
      chips: [this.listaZonaCorporalHijos, []]
    });
  }
  zonaCorporalByGeneroListar(idGenero: number): void {
    this.zonaCorporalService.zonaCorporalByGeneroListar(idGenero).subscribe( resultado => {
      this.listaMZonasCorporalesPorGenero = resultado;
    });
  }
  agregarZonaCorporalHijo(): void{
    if (this.frmZonaCorporalHijo.value.cboZonaCorporalPorGenero === '') {  return; }
    const zonaHijo = {
      id: 0,
      idZonaCorporal: this.idZonaCorporalPadre,
      idSubZonaCorporal: parseInt(this.frmZonaCorporalHijo.value.cboZonaCorporalPorGenero, 10),
      usuarioRegistra: this.usuarioActual.nombre,
      descripcion: (document.getElementById('cboZonaCorporalPorGenero') as HTMLSelectElement).selectedOptions[0].label
    };
    this.listaZonaCorporalHijos.push(zonaHijo);
    this.frmZonaCorporalHijo.patchValue({ cboZonaCorporalPorGenero: '' });
  }
  cerrarModal(): void {
    this.modal.close();
  }

  removeTag(event): void {
    
  }
}
