import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../../shared/services/funciones/utils.service';

@Component({
  selector: 'app-promocion-ayuda-plantilla',
  templateUrl: './promocion-ayuda-plantilla.component.html',
  styleUrls: ['./promocion-ayuda-plantilla.component.scss']
})
export class PromocionAyudaPlantillaComponent implements OnInit {
  @Input() modal: NgbModalRef;
  varFechaInicio = '${FechaInicio}';
  varFechaTermino = '${FechaTermino}';
  varNombrePromocion = '${Promocion}';
  varNombreZona = '${NombreZona}'
  varDetalleZona = '${DetalleZona}'
  varPrecioBase = '${PrecioBase}';
  varPrecioDescuento = '${PrecioDescuento}';

  constructor(
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.modal.close();
  }

  copyToClipboard(span): void{
    const texto = span.innerText;
    const el = document.createElement('textarea');
    el.value = texto;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.utilsService.mostrarToast('variable copiada', 'success');
    this.cerrarModal();
  };
}
