import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsuarioService} from "../../shared/services/usuario.service";
import {FacturaTipoDocumento} from "../../shared/models/facturacion/factura-tipo-documento";
import {TblFacturaTipoDocumentoComponent} from "../../componentes/tables/facturacion/tbl-factura-tipo-documento/tbl-factura-tipo-documento.component";
import {MdlFacturaTipoDocumentoComponent} from "../../componentes/modals/facturacion/mdl-factura-tipo-documento/mdl-factura-tipo-documento.component";

@Component({
  selector: 'app-factura-tipo-documento',
  templateUrl: './factura-tipo-documento.component.html',
  styleUrls: ['./factura-tipo-documento.component.scss']
})
export class FacturaTipoDocumentoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblFacturaTipoDocumentoComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: FacturaTipoDocumento | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: FacturaTipoDocumento | null) => {
      this.selected = res;
    });
  }

  onReload(): void{
    this.tabla.reload(true);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlFacturaTipoDocumentoComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlFacturaTipoDocumentoComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    });
  }

}
