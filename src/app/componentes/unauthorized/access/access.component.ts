import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  clearCacheAndReload() {
    // Limpiar el localStorage y sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  
    // Borrar todas las cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
  
    // Forzar la recarga sin usar caché
    location.reload();

    // Otra forma de forzar la recarga sin usar caché
    window.location.href = window.location.origin + '?_=' + new Date().getTime();
  }
  
}
