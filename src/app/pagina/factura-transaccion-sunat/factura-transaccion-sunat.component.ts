import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsuarioService} from "../../shared/services/usuario.service";
import {FacturaTransaccionSunat} from "../../shared/models/facturacion/factura-transaccion-sunat";
import {MdlFacturaTransaccionSunatComponent} from "../../componentes/modals/facturacion/mdl-factura-transaccion-sunat/mdl-factura-transaccion-sunat.component";
import {TblFacturaTransaccionSunatComponent} from "../../componentes/tables/facturacion/tbl-factura-transaccion-sunat/tbl-factura-transaccion-sunat.component";

@Component({
  selector: 'app-factura-transaccion-sunat',
  templateUrl: './factura-transaccion-sunat.component.html',
  styleUrls: ['./factura-transaccion-sunat.component.scss']
})
export class FacturaTransaccionSunatComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblFacturaTransaccionSunatComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: FacturaTransaccionSunat | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected?.subscribe((res: FacturaTransaccionSunat | null) => {
      this.selected = res;
    });
  }

  onReload(): void{
    this.tabla.reload(true);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlFacturaTransaccionSunatComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlFacturaTransaccionSunatComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    });
  }

}
