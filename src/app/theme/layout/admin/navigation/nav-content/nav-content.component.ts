import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationItem} from '../navigation';
import {DattaConfig} from '../../../../../app-config';
import {Location} from '@angular/common';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';
import {GlobalConstants} from "../../../../../../commons/global-constants";
import {MensajeSignalR, SignalRService} from "../../../../../shared/services/signal-r.service";
import {TipoMensajeSignalR, TipoPerfil} from "../../../../../shared/enumeracion/enums";
import Swal from "sweetalert2";
import {MenuService} from "../../../../../shared/services/menu.service";

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit, AfterViewInit {
  @Output() onNavCollapsedMob = new EventEmitter();

  public dattaConfig: any;
  public navigation: any;
  public prevDisabled: string;
  public nextDisabled: string;
  public contentWidth: number;
  public wrapperWidth: any;
  public scrollWidth: any;
  public windowWidth: number;

  @ViewChild('navbarContent', {static: false}) navbarContent: ElementRef;
  @ViewChild('navbarWrapper', {static: false}) navbarWrapper: ElementRef;
  private userSubject: BehaviorSubject<User>;
  usuarioActual: Usuario;

  public loadingNav = false;




  constructor(
      public nav: NavigationItem,
      private location: Location,
      private usuarioService: UsuarioService,
      private router: Router,
      private signalRService: SignalRService,
      private menuService: MenuService
    ) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('usersKey')));
      this.dattaConfig = DattaConfig.config;
      this.windowWidth = window.innerWidth;
      this.prevDisabled = 'disabled';
      this.nextDisabled = '';
      this.scrollWidth = 0;
      this.contentWidth = 0;
  }

  ngOnInit() {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    if(this.usuarioActual.menu == undefined) {
      localStorage.removeItem('usersKey');
      this.userSubject.next(null);
      this.router.navigate(['/account/login']);
    }
    this.navigation  = this.usuarioActual.menu;
  console.log('soy navigation', this.navigation);


    if (this.windowWidth < 992) {
      this.dattaConfig['layout'] = 'vertical';
      setTimeout(() => {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-datta') as HTMLElement).style.maxHeight = '100vh';
      }, 500);
    }

    GlobalConstants.gSignalService = this.signalRService;
    GlobalConstants.gSignalService.signalReceived.subscribe((trama: MensajeSignalR) => this.procesarMensajeSignalR(trama))
  }

  ngAfterViewInit() {
    if (this.dattaConfig['layout'] === 'horizontal') {
      this.contentWidth = this.navbarContent.nativeElement.clientWidth;
      this.wrapperWidth = this.navbarWrapper.nativeElement.clientWidth;
    }
  }

  scrollPlus() {
    this.scrollWidth = this.scrollWidth + (this.wrapperWidth - 80);
    if (this.scrollWidth > (this.contentWidth - this.wrapperWidth)) {
      this.scrollWidth = this.contentWidth - this.wrapperWidth + 80;
      this.nextDisabled = 'disabled';
    }
    this.prevDisabled = '';
    (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
  }

  scrollMinus() {
    this.scrollWidth = this.scrollWidth - this.wrapperWidth;
    if (this.scrollWidth < 0) {
      this.scrollWidth = 0;
      this.prevDisabled = 'disabled';
    }
    this.nextDisabled = '';
    (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
  }

  fireLeave() {
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('pcoded-trigger');
    }

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
        parent.classList.add('active');
      } else if(up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open')) {
      this.onNavCollapsedMob.emit();
    }
  }

  fireOutClick() {
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


  procesarMensajeSignalR(trama: MensajeSignalR): void {

    switch (trama.tipo) {
      case TipoMensajeSignalR.MenuActualizado: {

        if(trama.datos.IdPerfil === this.usuarioService.UsuarioActual.idperfil){
          console.log('encontrado')

          this.loadingNav = true;
          this.menuService.obtenerMenuByPerfil(trama.datos.IdPerfil).subscribe((res) => {
            this.navigation = res;

            const usuario: any = JSON.parse(localStorage.getItem('usersKey'));
            usuario.menu = res;
            localStorage.setItem('usersKey',JSON.stringify(usuario));
            this.loadingNav = false;

          }, error => {
            console.log(error);
            this.loadingNav = false;
          })
        }else{
          console.log('noencontrado', trama.datos.IdPerfil, this.usuarioService.UsuarioActual.idperfil);
          // console.log(localStorage.getItem('usersKey'));
        }

        break;
      }
    }
  }
}
