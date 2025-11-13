import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsuarioService} from "../../shared/services/usuario.service";
import {TblFacturaTipoIgvComponent} from "../../componentes/tables/facturacion/tbl-factura-tipo-igv/tbl-factura-tipo-igv.component";
import {FacturaTipoIgv} from "../../shared/models/facturacion/factura-tipo-igv";
import {MdlFacturaTipoIgvComponent} from "../../componentes/modals/facturacion/mdl-factura-tipo-igv/mdl-factura-tipo-igv.component";

@Component({
  selector: 'app-factura-tipo-igv',
  templateUrl: './factura-tipo-igv.component.html',
  styleUrls: ['./factura-tipo-igv.component.scss']
})
export class FacturaTipoIgvComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblFacturaTipoIgvComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: FacturaTipoIgv | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: FacturaTipoIgv | null) => {
      this.selected = res;
    });
  }

  onReload(reset: boolean = true): void{
    this.tabla.reload(reset);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlFacturaTipoIgvComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(true);
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlFacturaTipoIgvComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(false);
      }
    });
  }

}
