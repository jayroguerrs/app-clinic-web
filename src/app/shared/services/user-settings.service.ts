import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonalizarClinic } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private colorFondoSubject = new BehaviorSubject<string>('#007bff');
  private colorTextoSubject = new BehaviorSubject<string>('#a9b7d0');
  private fondoPantallaSubject = new BehaviorSubject<string>('');

  public colorFondo$ = this.colorFondoSubject.asObservable();
  public colorTexto$ = this.colorTextoSubject.asObservable();
  public fondoPantalla$ = this.fondoPantallaSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {
    this.cargarColoresGuardados();
  }

  actualizarColorFondo(color: string): void {
    this.colorFondoSubject.next(color);
    localStorage.setItem('userColorFondo', color);
    this.aplicarColorSidebar(color, this.colorTextoSubject.value);
  }

  actualizarColorTexto(color: string): void {
    this.colorTextoSubject.next(color);
    localStorage.setItem('userColorTexto', color);
    this.aplicarColorSidebar(this.colorFondoSubject.value, color);
  }

  actualizarFondoPantalla(fondo: string): void {
    this.fondoPantallaSubject.next(fondo);
    localStorage.setItem('userFondoPantalla', fondo);
    this.aplicarFondoPantalla(fondo);
  }

  private cargarColoresGuardados(): void {
    const colorFondo = localStorage.getItem('userColorFondo') || "#3f4d67"; // ✅ Cambiar a null
    const colorTexto = localStorage.getItem('userColorTexto') || "#A9B7D0";  // ✅ Cambiar a null
    const fondoPantalla = localStorage.getItem('userFondoPantalla') || '';

    // Solo establecer valores si existen en localStorage
    if (colorFondo) {
        this.colorFondoSubject.next(colorFondo);
    }
    if (colorTexto) {
        this.colorTextoSubject.next(colorTexto);
    }
    this.fondoPantallaSubject.next(fondoPantalla);

    // Aplicar colores al cargar
    setTimeout(() => {
      this.aplicarColorSidebar(colorFondo, colorTexto);
      if (fondoPantalla) {
        this.aplicarFondoPantalla(fondoPantalla);
      }
    }, 100);
  }

  private aplicarFondoPantalla(fondo: string): void {
    const mainContainer = document.querySelector('.pcoded-main-container') as HTMLElement;
    if (mainContainer && fondo) {
      mainContainer.style.backgroundImage = `url(${fondo})`;
      mainContainer.style.backgroundSize = 'cover';
      mainContainer.style.backgroundRepeat = 'no-repeat';
      mainContainer.style.backgroundAttachment = 'fixed';
    }
  }

  get colorFondoActual(): string | null {
      const color = this.colorFondoSubject.value;
      return color === '#007bff' ? null : color;
  }

  get colorTextoActual(): string | null {
      const color = this.colorTextoSubject.value;
      return color === '#a9b7d0' ? null : color;
  }

  get fondoPantallaActual(): string {
    return this.fondoPantallaSubject.value;
  }

  private aplicarColorSidebar(colorFondo: string | null, colorTexto: string | null): void {
      // ✅ Verificar que los colores no sean los valores por defecto
      if (!colorFondo || !colorTexto || 
          colorFondo === '#007bff' || colorTexto === '#FFFFFF') {
          return; // No aplicar estilos si son valores por defecto
      }

      const sidebar = document.querySelector('.pcoded-navbar') as HTMLElement;
      if (sidebar) {
          sidebar.style.background = colorFondo;
          sidebar.style.color = colorTexto;
          
          // Aplicar a elementos internos del sidebar
          const enlaces = sidebar.querySelectorAll('a, .nav-link, .pcoded-mtext');
          enlaces.forEach((enlace: any) => {
              enlace.style.color = colorTexto;
          });

          // Aplicar a iconos
          const iconos = sidebar.querySelectorAll('i');
          iconos.forEach((icono: HTMLElement) => {
              icono.style.color = colorTexto;
          });

          // Aplicar específicamente a nav-collapse elementos
          const navCollapseItems = sidebar.querySelectorAll('.nav-item.pcoded-hasmenu');
          navCollapseItems.forEach((item: any) => {
              const submenus = item.querySelectorAll('.pcoded-submenu');
              submenus.forEach((submenu: any) => {
                  submenu.style.backgroundColor = this.adjustBrightness(colorFondo, -10);
              });
          });
      }
  }

  private adjustBrightness(color: string, amount: number): string {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
  }

  personalizarClinic(model: PersonalizarClinic): Observable<PersonalizarClinic>{
    return this.http.put<any>(`${environment.apiUrl}/api/usuario/personalizarClinic`, model)
  }
}
