import {Component, Input, OnInit} from '@angular/core';
import {NavigationItem} from '../../navigation';
import {animate, group, state, style, transition, trigger} from '@angular/animations';
import {DattaConfig} from '../../../../../../app-config';
import { Subscription } from 'rxjs';
import { UserSettingsService } from '../../../../../../shared/services/user-settings.service';

@Component({
  selector: 'app-nav-collapse',
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)', display: 'block'}),
        animate('250ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ],
})
export class NavCollapseComponent implements OnInit {
  public visible;
  @Input() item: NavigationItem;
  public dattaConfig: any;
  public themeLayout: string;

  private subscriptions: Subscription[] = []; // ✅ Para manejar suscripciones

  constructor(private userSettingsService: UserSettingsService) {
    this.visible = false;
    this.dattaConfig = DattaConfig.config;
    this.themeLayout = this.dattaConfig['layout'];
  }

  ngOnInit() {
    const colorFondoSub = this.userSettingsService.colorFondo$.subscribe(colorFondo => {
      this.aplicarColores(colorFondo, this.userSettingsService.colorTextoActual);
    });

    const colorTextoSub = this.userSettingsService.colorTexto$.subscribe(colorTexto => {
      this.aplicarColores(this.userSettingsService.colorFondoActual, colorTexto);
    });

    this.subscriptions.push(colorFondoSub, colorTextoSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  navCollapse(e) {
    this.visible = !this.visible;

    let parent = e.target;
    if (this.themeLayout === 'vertical') {
      parent = parent.parentElement;
    }

    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      if (sections[i] !== parent) {
        sections[i].classList.remove('pcoded-trigger');
      }
    }

    let first_parent = parent.parentElement;
    let pre_parent = parent.parentElement.parentElement;
      if (first_parent.classList.contains('pcoded-hasmenu')) {
        do {
          first_parent.classList.add('pcoded-trigger');
          first_parent = first_parent.parentElement.parentElement.parentElement;
        } while (first_parent.classList.contains('pcoded-hasmenu'));
      } else if (pre_parent.classList.contains('pcoded-submenu')) {
        do {
          pre_parent.parentElement.classList.add('pcoded-trigger');
          pre_parent = pre_parent.parentElement.parentElement.parentElement;
        } while (pre_parent.classList.contains('pcoded-submenu'));
      }
      parent.classList.toggle('pcoded-trigger');
  }

  private aplicarColores(colorFondo: string, colorTexto: string): void {
    if (!colorFondo || !colorTexto || 
        colorFondo === '#007bff' || colorTexto === '#a9b7d0') {
        return; // No aplicar estilos personalizados
    }

    setTimeout(() => {
      const navItems = document.querySelectorAll('.nav-item.pcoded-hasmenu');
      
      navItems.forEach((navItem: any) => {
        // Aplicar color de fondo a los enlaces principales
        const enlaces = navItem.querySelectorAll('a.nav-link');
        enlaces.forEach((enlace: any) => {
          enlace.style.color = colorTexto;

          enlace.style.transition = 'all 0.3s ease';
          
          enlace.addEventListener('mouseleave', () => {
            enlace.style.backgroundColor = 'transparent';
          });
        });

        // Aplicar colores a los submenús
        const submenus = navItem.querySelectorAll('.pcoded-submenu');
        submenus.forEach((submenu: any) => {
          submenu.style.backgroundColor = this.adjustBrightness(colorFondo, -10);
          
          const enlacesSubmenu = submenu.querySelectorAll('a');
          enlacesSubmenu.forEach((enlaceSubmenu: HTMLElement) => {
            enlaceSubmenu.style.color = colorTexto;
          });
        });

        // Aplicar colores a iconos y texto
        const iconos = navItem.querySelectorAll('i');
        iconos.forEach((icono: HTMLElement) => {
          icono.style.color = colorTexto;
        });

        const textos = navItem.querySelectorAll('.pcoded-mtext');
        textos.forEach((texto: any) => {
          texto.style.color = colorTexto;
        });

        // Aplicar colores a badges si existen
        const badges = navItem.querySelectorAll('.pcoded-badge, .badge');
        badges.forEach((badge: any) => {
          badge.style.backgroundColor = this.adjustBrightness(colorTexto, -20);
          badge.style.color = colorFondo;
        });
      });
    }, 100);


  }

  // ✅ Función auxiliar para ajustar brillo del color
  private adjustBrightness(color: string, amount: number): string {
    // Remover el # si existe
    const hex = color.replace('#', '');
    
    // Extraer componentes RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Aplicar ajuste y mantener en rango 0-255
    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));
    
    // Convertir de vuelta a hex con padding
    const result = '#' + 
      newR.toString(16).padStart(2, '0') +
      newG.toString(16).padStart(2, '0') +
      newB.toString(16).padStart(2, '0');
    
    return result;
  }

}
