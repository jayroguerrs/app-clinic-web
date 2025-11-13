import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UsuarioService} from "../../shared/services/usuario.service";
import {TblFacturaTokenComponent} from "../../componentes/tables/facturacion/tbl-factura-token/tbl-factura-token.component";
import {FacturaToken} from "../../shared/models/facturacion/factura-token";
import {MdlFacturaTokenComponent} from "../../componentes/modals/facturacion/mdl-factura-token/mdl-factura-token.component";

@Component({
  selector: 'app-factura-token',
  templateUrl: './factura-token.component.html',
  styleUrls: ['./factura-token.component.scss']
})
export class FacturaTokenComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblFacturaTokenComponent | undefined;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  selected: FacturaToken | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tabla.selected.subscribe((res: FacturaToken | null) => {
      this.selected = res;
    });
  }

  onReload(): void{
    this.tabla.reload(true);
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlFacturaTokenComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlFacturaTokenComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    });
  }

}
