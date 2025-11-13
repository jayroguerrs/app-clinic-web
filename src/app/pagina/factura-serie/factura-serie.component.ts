import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Usuario} from "../../shared/models";
import {AuthService} from "../../shared/services/auth.service";
import {UsuarioService} from "../../shared/services/usuario.service";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {TblFacturaSerieComponent} from "../../componentes/tables/tbl-factura-serie/tbl-factura-serie.component";
import {MdlFacturaSerieComponent} from "../../componentes/modals/mdl-factura-serie/mdl-factura-serie.component";
import {FacturaSerie} from "../../shared/models/factura-serie";

@Component({
  selector: 'app-factura-serie',
  templateUrl: './factura-serie.component.html',
  styleUrls: ['./factura-serie.component.scss']
})
export class FacturaSerieComponent implements OnInit, OnDestroy, AfterViewInit {

  usuarioActual: Usuario;
  @ViewChild('facturaSerie') tblFacturaSerie: TblFacturaSerieComponent;
  modalRef: any;
  selected: FacturaSerie | null;
  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.tblFacturaSerie?.selected.subscribe((res: FacturaSerie | null) => {
      this.selected = res;
    });
  }

  onReload(currentPage: boolean = false): void{
    this.tblFacturaSerie?.reload(currentPage);
  }

  onCreate(): void{
    this.modalRef = this.modalService.open(MdlFacturaSerieComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    this.modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }


  onEdit(): void{
    const modalRef = this.modalService.open(MdlFacturaSerieComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload(true);
      }
    });
  }


}
