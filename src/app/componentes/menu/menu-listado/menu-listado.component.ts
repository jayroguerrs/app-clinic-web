import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PerfilService } from '../../../shared/services/perfil.service';
import { GlobalConstants } from '../../../../commons/global-constants';
import { TipoPerfil } from '../../../shared/enumeracion/enums';

@Component({
  selector: 'app-menu-listado',
  templateUrl: './menu-listado.component.html',
  styleUrls: ['./menu-listado.component.scss']
})
export class MenuListadoComponent implements OnInit {

  frmMenuListado: FormGroup;
  maestroMenu: any = [];
  rutaImageSpinner = GlobalConstants.gIconoSpinner;

  constructor(
    private spinner: NgxSpinnerService,
    private perfilService: PerfilService
  ) { }

  ngOnInit(): void {
    this.menuListado();
  }

  seleccionar(menu): void {
  }
  grabarMenu(): void {

  }
  menuListado() {
    this.spinner.show();
    this.perfilService.obtenerById(TipoPerfil.OPERADOR).subscribe(
      resultado => {
        this.maestroMenu = resultado.menus;
        this.spinner.hide();
      },
      error => {
        console.log('Error al obtener el menu', error);
        this.spinner.hide();
      }
    );
  }

}
