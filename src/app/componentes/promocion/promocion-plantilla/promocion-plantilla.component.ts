import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { PromocionBloqueService } from 'src/app/shared/services/promocionBloque.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-promocion-plantilla',
  templateUrl: './promocion-plantilla.component.html',
  styleUrls: ['./promocion-plantilla.component.scss'],
})
export class PromocionPlantillaComponent implements OnInit {

  @Input() idPromocion: number;
  @Input() modal:NgbModalRef;
  @Input() promocion: string;
  modalAyudaPlantillaRef: NgbModalRef;
  usuarioActual: Usuario;
  frmPromocionPlantilla: FormGroup;
  promocionBloques = [];
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private promocionBloqueService: PromocionBloqueService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.obtenerPromocionBloqueByIdPromocion();
  }

  inicializarFormulario():void {
    this.frmPromocionPlantilla = this.formBuilder.group({
      nombre: [this.promocion],
    });
  }
  obtenerPromocionBloqueByIdPromocion() {
    this.spinner.show();

    //obtiene los bloques configurados por cada zona de la promocion
    this.promocionBloqueService.obtenerByIdPromocion(this.idPromocion).subscribe(
      resultado => {
        this.promocionBloques = resultado;
        this.spinner.hide();
      }, 
      error => {
        console.log('Error en obtener PromocionBloque ' + error);
        this.spinner.hide();
      }
    );
  }
  cerrarModal(): void { this.modal.close() }
  plantillaGrabar(): void {
    this.promocionBloqueService.grabarPlantillas(this.promocionBloques).subscribe(
      resultado => {this.utilsService.mostrarToast('SE ACTUALIZÓ LAS PLANTILLAS', 'info'); this.cerrarModal();},
      error => console.log('Error al grabar plantilla ' + error));
  }
  actualizaValores(target, idPromocionBloque: number): void {
    const promocionBloque = this.promocionBloques.find(x => x.id == idPromocionBloque);
    promocionBloque.plantilla = target.value;
  }
  mostrarVariablesPlantilla(modal: any): void {
    this.modalAyudaPlantillaRef = this.utilsService.abrirModal(modal, 'md');
  }
}