import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-configuracion-menu',
  templateUrl: './perfil-configuracion-menu.component.html',
  styleUrls: ['./perfil-configuracion-menu.component.scss']
})
export class PerfilConfiguracionMenuComponent implements OnInit {
  @Input() menu;
  constructor() { }

  ngOnInit(): void {
  }
  menuSeleccionado(input): void {
    const id = parseInt(input.getAttribute('id'), 10);
    const chequeado = (input as HTMLInputElement).checked;

    const hijos = $('[idPadre=' + id +']').toArray();
    if(chequeado){
      hijos.forEach(element => {
        // console.log(element);
      });
    }

  }

}
