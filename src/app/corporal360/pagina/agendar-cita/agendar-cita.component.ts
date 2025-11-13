import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.scss']
})
export class AgendarCitaComponent implements OnInit {

  titulo: string = 'CITA: NUEVA';
  titulo2: string = '';
  colorFuente: string = '';

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
