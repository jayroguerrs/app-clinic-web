import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsuarioService} from "../../shared/services/usuario.service";
import {TblFacturaPorcentajeIgvComponent} from "../../componentes/tables/facturacion/tbl-factura-porcentaje-igv/tbl-factura-porcentaje-igv.component";
import { FacturaPorcentajeIgv } from 'src/app/shared/models/facturacion/factura-porcentaje-igv';
import {MdlFacturaPorcentajeIgvComponent} from "../../componentes/modals/facturacion/mdl-factura-porcentaje-igv/mdl-factura-porcentaje-igv.component";

@Component({
  selector: 'app-factura-porcentaje-igv',
  templateUrl: './factura-porcentaje-igv.component.html',
  styleUrls: ['./factura-porcentaje-igv.component.scss']
})
export class FacturaPorcentajeIgvComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblFacturaPorcentajeIgvComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: FacturaPorcentajeIgv | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: FacturaPorcentajeIgv | null) => {
      this.selected = res;
    });
  }

  onReload(): void{
    this.tabla.reload(true);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlFacturaPorcentajeIgvComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlFacturaPorcentajeIgvComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    });
  }

}
