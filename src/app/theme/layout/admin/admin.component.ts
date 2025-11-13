import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DattaConfig } from '../../../app-config';
import { Location } from '@angular/common';
import { User } from '../../../shared/models'; 
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from '../../../shared/models'; 
import { environment } from '../../../../environments/environment';
import { NavBarService } from "../../../shared/services/nav-bar.service";
import { UserSettingsService } from '../../../shared/services/user-settings.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { Subscription } from 'rxjs';
import { ParametroSistemaService } from '../../../shared/services/parametro-sistema.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  user: User;
  public dattaConfig: any;
  public navCollapsed: boolean;
  public navCollapsedMob: boolean;
  public windowWidth: number;
  usuarioActual: Usuario;

  showNavBarTop: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private location: Location,
    private usuarioService: UsuarioService,
    private navBarService: NavBarService,
    private eRef: ElementRef,
    private userSettingsService: UserSettingsService,
    private utilsService: UtilsService,
    private parametroSistemaService: ParametroSistemaService,
    private router: Router
  ) {
    this.dattaConfig = DattaConfig.config;
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }

    if (current_url === this.location['_baseHref'] + '/layout/collapse-menu' || current_url === this.location['_baseHref'] + '/layout/box') {
      this.dattaConfig['collapse-menu'] = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = (this.windowWidth >= 992) ? this.dattaConfig['collapse-menu'] : false;
    this.navCollapsedMob = false;

    this.navBarService._showNavBarTop.subscribe((res: boolean) => {
      this.showNavBarTop = res;
    });
  }

  ngOnInit() {
    const usuarioSub = this.usuarioService.usuarioActual$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
    this.subscriptions.push(usuarioSub);

    this.usuarioActual = this.usuarioService.UsuarioActual;
    // Suscribirse a cambios de colores
    this.userSettingsService.colorFondo$.subscribe(color => {
      this.aplicarColorSidebar(color, this.userSettingsService.colorTextoActual ?? '');
    });

    this.userSettingsService.colorTexto$.subscribe(color => {
      this.aplicarColorSidebar(this.userSettingsService.colorFondoActual ?? '', color);
    });

    this.userSettingsService.fondoPantalla$.subscribe(fondo => {
      if (fondo) {
        this.aplicarFondoPantalla(fondo);
      } else {
        $('.pcoded-main-container').css('background-image', `url(${environment.imagenEntorno})`);
      }
    });
    $('body').css('background', environment.colorFondo);
  }

  private aplicarColorSidebar(colorFondo: string, colorTexto: string): void {
    setTimeout(() => {
      const sidebar = document.querySelector('.pcoded-navbar') as HTMLElement;
      if (sidebar) {
        sidebar.style.background = colorFondo;
        sidebar.style.color = colorTexto;
        
        // Aplicar a elementos internos
        const enlaces = sidebar.querySelectorAll('a, .nav-link, .pcoded-mtext');
        enlaces.forEach((enlace: any) => {
          enlace.style.color = colorTexto;
        });

        const iconos = sidebar.querySelectorAll('i');
        iconos.forEach((icono: HTMLElement) => {
          icono.style.color = colorTexto;
        });
      }
    }, 100);
  }

  private aplicarFondoPantalla(fondo: string): void {
    setTimeout(() => {
      $('.pcoded-main-container').css({
        'background-image': `url(${fondo})`,
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-attachment': 'fixed'
      });
    }, 100);
  }

  ngAfterViewInit(): void {
    try {
        this.parametroSistemaService.obtenerById(16).subscribe((res) => {
          let atmosphere = res.response?.valor;
          if(atmosphere?.toUpperCase() === 'QA'){
            this.router.navigate(['/Unauthorized/environment-access'])
          }
        });
    } catch (error) {
        console.error('XXX: Error al obtener el entorno actual:', error);
    }
  }

  navMobClick() {
    const navElement = document.querySelector('app-navigation.pcoded-navbar');
    if (
      this.navCollapsedMob &&
      !(navElement && navElement.classList.contains('mob-open'))
    ) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.navCollapsedMob = false;
    }
  }

  mdlActualizarDatosUser: NgbModalRef;
  
  actualizarDatosUser(modal: any): void{
    this.mdlActualizarDatosUser = this.utilsService.abrirModal(modal, 'lg');
    this.mdlActualizarDatosUser.result.then(result => console.log(result, "reeeeeeeeeeeeeeeeeeeeeeeeeee"));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}