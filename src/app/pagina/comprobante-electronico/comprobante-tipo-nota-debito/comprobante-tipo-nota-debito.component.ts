import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {TblComprobanteTipoNotaDebitoComponent} from "../../../componentes/tables/facturacion/tbl-comprobante-tipo-nota-debito/tbl-comprobante-tipo-nota-debito.component";
import {ComprobanteTipoNotaDebito} from "../../../shared/models/facturacion/comprobante-nota-debito";
import {MdlComprobanteTipoNotaDebitoComponent} from "../../../componentes/modals/facturacion/mdl-comprobante-tipo-nota-debito/mdl-comprobante-tipo-nota-debito.component";

@Component({
  selector: 'app-comprobante-tipo-nota-debito',
  templateUrl: './comprobante-tipo-nota-debito.component.html',
  styleUrls: ['./comprobante-tipo-nota-debito.component.scss']
})
export class ComprobanteTipoNotaDebitoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblComprobanteTipoNotaDebitoComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: ComprobanteTipoNotaDebito | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: ComprobanteTipoNotaDebito | null) => {
      this.selected = res;
    });
  }

  onReload(reset: boolean = true): void{
    this.tabla.reload(reset);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlComprobanteTipoNotaDebitoComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(true);
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlComprobanteTipoNotaDebitoComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(false);
      }
    });
  }

}
