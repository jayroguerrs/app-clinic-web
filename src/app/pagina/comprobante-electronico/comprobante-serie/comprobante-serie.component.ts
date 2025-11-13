import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TblComprobanteSerieComponent} from "../../../componentes/tables/facturacion/tbl-comprobante-serie/tbl-comprobante-serie.component";
import {ComprobanteSerie} from "../../../shared/models/facturacion/comprobante-serie";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {MdlComprobanteSerieComponent} from "../../../componentes/modals/facturacion/mdl-comprobante-serie/mdl-comprobante-serie.component";

@Component({
  selector: 'app-comprobante-serie',
  templateUrl: './comprobante-serie.component.html',
  styleUrls: ['./comprobante-serie.component.scss']
})
export class ComprobanteSerieComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblComprobanteSerieComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: ComprobanteSerie | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: ComprobanteSerie | null) => {
      this.selected = res;
    });
  }

  onReload(): void{
    this.tabla.reload(true);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlComprobanteSerieComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlComprobanteSerieComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    });
  }

}
