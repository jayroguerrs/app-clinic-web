import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationItem} from '../../navigation';
import {Location} from '@angular/common';
import {DattaConfig} from '../../../../../../app-config';
import { UsuarioService } from '../../../../../../shared/services/usuario.service';
import { Usuario } from '../../../../../../shared/models';
import {AuthService} from "../../../../../../shared/services/auth.service";
import {EstadosService} from "../../../../../../shared/services/estados.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {PreferenteService} from "../../../../../../shared/services/preferente.service";
import {UtilsService} from "../../../../../../shared/services/funciones/utils.service";
import { TipoPerfil } from 'src/app/shared/enumeracion/enums';
import Timeout = NodeJS.Timeout;

@Component({
  selector: 'app-nav-group',
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() item: NavigationItem;
  public dattaConfig: any;
  public usuarioActual: Usuario;
  itemSalir: any;

  hayNotificacion = false;


  pendientesPreferentes = 0;
  sbcPreferentes: Subscription | undefined;
  intervalo: Timeout | undefined;

  constructor(
    private location: Location,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private estadosService: EstadosService,
    private route: Router,
    private preferenteService: PreferenteService,
    private util: UtilsService
  ) {
    this.dattaConfig = DattaConfig.config;

    this.itemSalir =
      {
        idMenu: 100,
        idPadre: 1,
        title: 'Salir',
        idMenuTipo: null,
        icon: 'fa fa-arrow-left',
        url: '/',
        id: 'Salir',
        visible: true,
        nivel: null,
        type: 'item',
        children: [],
        seleccionado: false
    };

  }

  Lock(){
    // localStorage.clear();
    // window.location.reload();
    this.authService.logout();
  }

  ngOnInit(): void {

    this.estadosService.notificacion.subscribe((res: boolean) => {
      this.hayNotificacion = res;
    });

    this.usuarioActual = this.usuarioService.UsuarioActual;
    // at reload time active and trigger link
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        if (this.dattaConfig['layout'] === 'vertical') {
          parent.classList.add('pcoded-trigger');
        }
        parent.classList.add('active');
      } else if(up_parent.classList.contains('pcoded-hasmenu')) {
        if (this.dattaConfig['layout'] === 'vertical') {
          up_parent.classList.add('pcoded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        if (this.dattaConfig['layout'] === 'vertical') {
          last_parent.classList.add('pcoded-trigger');
        }
        last_parent.classList.add('active');
      }
    }

  }

  ngOnDestroy(): void{
    this.sbcPreferentes?.unsubscribe();
    clearInterval(this.intervalo);
  }

  ngAfterViewInit(): void {
    if(this.usuarioActual.idperfil === TipoPerfil.GERENCIA || this.usuarioActual.idperfil === TipoPerfil.ADMINISTRADOR_3 || this.usuarioActual.idperfil === TipoPerfil.SISTEMAS){
      this.intervalo = setInterval(() => {
        this.obtenerPreferentesPendientes()
      }, 30000);
    }
  }

  irPreferente(): void{
    if(this.pendientesPreferentes){
      this.route.navigate(['Preferente']);
      return;
    }
    if(this.estadosService.getNotificacion()){
      this.estadosService.setNotificacion(false);
      this.route.navigate(['Preferente']);
    }
  }

  /*******************************************************************************************************
   * Data
   */
  obtenerPreferentesPendientes(): void{
    this.sbcPreferentes?.unsubscribe();
    this.sbcPreferentes = this.preferenteService.obtenerPendientesActuales().subscribe((data: number) => {
      this.pendientesPreferentes = data;
    }, (error: any) => {
      this.util.mostrarToast("No se pudo obtener la cantidad de preferentes","error");
    });
  }

}
