import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsuarioService} from "../../shared/services/usuario.service";
import {TblFacturaMonedaComponent} from "../../componentes/tables/facturacion/tbl-factura-moneda/tbl-factura-moneda.component";
import {FacturaMoneda} from "../../shared/models/facturacion/factura-moneda";
import {MdlFacturaMonedaComponent} from "../../componentes/modals/facturacion/mdl-factura-moneda/mdl-factura-moneda.component";

@Component({
  selector: 'app-factura-tipo-moneda',
  templateUrl: './factura-tipo-moneda.component.html',
  styleUrls: ['./factura-tipo-moneda.component.scss']
})
export class FacturaTipoMonedaComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblFacturaMonedaComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: FacturaMoneda | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: FacturaMoneda | null) => {
      this.selected = res;
    });
  }

  onReload(): void{
    this.tabla.reload(true);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlFacturaMonedaComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlFacturaMonedaComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    });
  }

}
