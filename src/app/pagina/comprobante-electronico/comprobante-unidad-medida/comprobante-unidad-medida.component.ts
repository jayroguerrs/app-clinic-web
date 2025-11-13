import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TblComprobanteUnidadMedidaComponent} from "../../../componentes/tables/facturacion/tbl-comprobante-unidad-medida/tbl-comprobante-unidad-medida.component";
import {ComprobanteUnidadMedida} from "../../../shared/models/facturacion/comprobante-unidad-medida";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {MdlComprobanteUnidadMedidaComponent} from "../../../componentes/modals/facturacion/mdl-comprobante-unidad-medida/mdl-comprobante-unidad-medida.component";

@Component({
  selector: 'app-comprobante-unidad-medida',
  templateUrl: './comprobante-unidad-medida.component.html',
  styleUrls: ['./comprobante-unidad-medida.component.scss']
})
export class ComprobanteUnidadMedidaComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblComprobanteUnidadMedidaComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: ComprobanteUnidadMedida | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: ComprobanteUnidadMedida | null) => {
      this.selected = res;
    });
  }

  onReload(reset: boolean = true): void{
    this.tabla.reload(reset);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlComprobanteUnidadMedidaComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(true);
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlComprobanteUnidadMedidaComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(false);
      }
    });
  }

}
