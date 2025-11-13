import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {TblComprobanteTipoNotaCreditoComponent} from "../../../componentes/tables/facturacion/tbl-comprobante-tipo-nota-credito/tbl-comprobante-tipo-nota-credito.component";
import {ComprobanteTipoNotaCredito} from "../../../shared/models/facturacion/comprobante-nota-credito";
import {MdlComprobanteTipoNotaCreditoComponent} from "../../../componentes/modals/facturacion/mdl-comprobante-tipo-nota-credito/mdl-comprobante-tipo-nota-credito.component";

@Component({
  selector: 'app-comprobante-tipo-nota-credito',
  templateUrl: './comprobante-tipo-nota-credito.component.html',
  styleUrls: ['./comprobante-tipo-nota-credito.component.scss']
})
export class ComprobanteTipoNotaCreditoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblComprobanteTipoNotaCreditoComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: ComprobanteTipoNotaCredito | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: ComprobanteTipoNotaCredito | null) => {
      this.selected = res;
    });
  }

  onReload(reset: boolean = true): void{
    this.tabla.reload(reset);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlComprobanteTipoNotaCreditoComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(true);
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlComprobanteTipoNotaCreditoComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(false);
      }
    });
  }

}
