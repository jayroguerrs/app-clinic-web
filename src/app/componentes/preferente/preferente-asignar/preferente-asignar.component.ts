import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { PreferenteService } from 'src/app/shared/services/preferente.service';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { SignalRService } from 'src/app/shared/services/signal-r.service';
import { GlobalConstants } from 'src/commons/global-constants';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-preferente-asignar',
  templateUrl: './preferente-asignar.component.html',
  styleUrls: ['./preferente-asignar.component.scss']
})
export class PreferenteAsignarComponent implements OnInit {
  @Input() listaMaestraTeleoperador: any[];
  @Input() id: number;
  @Input() listaTeleoperadorConfirmado: any[];
  @Input() modal: NgbModalRef;
  frmAsignar: FormGroup;
  usuarioActual: Usuario;

  usuarioAsignado: Usuario | null = null;

  listaFiltrada: any[];

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private preferenteService: PreferenteService,
    private usuarioService: UsuarioService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    this.listaFiltrada = this.listaTeleoperadorConfirmado;
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.frmAsignar = this.formBuilder.group({
      // asignarIdTeleoperadorAsignado: ['', Validators.required],
      asignarObservacion: [''],
      asignarBuscar: [null]
    });
    this.frmAsignar.get('asignarBuscar').valueChanges.subscribe((value: string) => {
      this.listaFiltrada = [];
      if(value){
        this.listaFiltrada = this.listaTeleoperadorConfirmado.filter(x => x.nombre.toLocaleLowerCase().includes( value.toLocaleLowerCase() ) );
      }else{
        this.listaFiltrada = this.listaTeleoperadorConfirmado;
      }
    })
  }
  preferenteAsignar(): void{
    if (this.frmAsignar.invalid){
      this.utilsService.mostrarToast('Datos incompletos!!!', 'error');
      return;
    }
    this.preferenteService.preferenteAsignar(this.preferente).subscribe(resultado => this.utilsService.mostrarToast('Preferente reasignado!!!', 'info'));
    this.cerrarModal();
  }
  cerrarModal(): void { this.modal.close(); }

  get f(): any{
    return this.frmAsignar.controls;
  }

  get preferente(): any{
    const model = {
      id: this.id,
      idTeleoperador: this.usuarioAsignado.idUsuario,
    // idTeleoperador: parseInt(this.frmAsignar.value.asignarIdTeleoperadorAsignado, 10),
      preferenteObservacion : this.f.asignarObservacion.value ? [
        {
          idPreferente: this.id,
          observacion: this.frmAsignar.value.asignarObservacion,
          usuarioRegistra: this.usuarioActual.nombre
        }
      ] : [],
      usuarioEdita: this.usuarioActual.nombre,
      idUsuarioRegistro: this.usuarioActual.idUsuario
      };
    return model;
  }
  escanearTeleoperador(): void {
    GlobalConstants.gSignalService.preferenteEscanearTeleoperador().subscribe(
      resultado =>
      {
        console.log('escanear teleoperador', resultado);
      }
    );
  }

  selectPreferente(usuario: any): void{
    this.usuarioAsignado = usuario;
  }
  usuarioIsSelect(usuario: any): boolean{

    return this.usuarioAsignado?.idUsuario === usuario.idUsuario;
  }
  antiguedad(usuario: any): number{
    // console.log(usuario);
    const fecha = new Date(usuario.fechaRegistra);
    // console.log(fecha);
    return this.monthDiff(fecha);
  }
  monthDiff(dateFrom: Date) {
    const dateTo = new Date();
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }

}
