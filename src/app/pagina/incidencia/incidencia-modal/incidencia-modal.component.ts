import { Component, Input, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClienteSeleccionComponent} from "../../../componentes/cliente/cliente-seleccion/cliente-seleccion.component";
import {Cliente} from "../../../shared/models/cliente";
import {BehaviorSubject, Subscription} from "rxjs";
import { Cita } from 'src/app/shared/models/cita';
import {CitaService} from "../../../shared/services/cita.service";

import Swal from 'sweetalert2';
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {ClienteIncidenciaService} from "../../../shared/services/cliente-incidencia.service";

@Component({
  selector: 'app-incidencia-modal',
  templateUrl: './incidencia-modal.component.html',
  styleUrls: ['./incidencia-modal.component.scss']
})
export class IncidenciaModalComponent implements OnInit {

  @Input() perfil = false;

  cliente = new BehaviorSubject<Cliente | null>(null);
  formGroup: FormGroup;
  citas: Cita[] = [];

  selected: Cita | null = null;
  submitted = false;

  created = false;
  updated = false;

  sbcCitasAtendidas : Subscription;
  loadingCitasAtendidas = false;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private citaService: CitaService,
    private formBuilder: FormBuilder,
    private utilService: UtilsService,
    private usuarioService: UsuarioService,
    private api: ClienteIncidenciaService
  ) {
    this.formGroup = this.formBuilder.group({
      idCita: new FormControl(null, Validators.required),
      descripcion : new FormControl(null, Validators.required)
    })
  }

  ngOnInit(): void {
    this.cliente.subscribe((res: Cliente | null) => {
      if(res){
        this.loadingCitasAtendidas = true;
        this.sbcCitasAtendidas = this.citaService.citasAtendidasPorCliente(res.id).subscribe((res: Cita[]) => {
          this.citas = res;
          this.loadingCitasAtendidas = false;
        }, error => {
          console.log(error);
          this.loadingCitasAtendidas = false;
        })
      }
    });
    console.log(this.perfil);
  }

  cerrarModal(): void{
    this.activeModal.close();
  }

  seleccionarCliente(): void{
    if(this.perfil){
      return;
    }
    const modalRef = this.modalService.open(ClienteSeleccionComponent,{
      size: 'lg'
    });
    modalRef.componentInstance.onSelect.subscribe((res: Cliente ) => {
      console.log(res);
      this.cliente.next(res);
    });
  }

  getCLiente(): string{
    if(this.cliente.value){
      return this.cliente.value.nombres + ' ' + this.cliente.value.apellidos;
    }
    return '';
  }

  select(cita: Cita):void{
    if(!this.selected){
      this.selected = cita;
      return;
    }

    if(this.selected.id === cita.id){
      this.selected = null;
    }
  }
  isSelect(cita: Cita): boolean{
    return this.selected === cita;
  }

  onSubmit(): void{
    this.submitted = true;
    if(!this.cliente.value){
      console.log('Debe seleccionar el cliente a encuestar');
      this.utilService.mostrarToast('Debe seleccionar el cliente a encuestar','warning');
      return;
    }
    if(this.formGroup.invalid){
      this.utilService.mostrarToast('Debe rellenar todos los campos','warning');
      return;
    }

    this.api.create(this.model).subscribe((res) => {
      if(res){
        this.created = true;
      }
      this.activeModal.close(this.created);
    }, error => {
      console.log(error);
    });
  }

  // getter
  get f(): any{
    return this.formGroup.controls;
  }

  get model(): any{
    return {
      idCita: this.f.idCita.value,
      idCliente: this.cliente.value.id,
      idUsuarioRegistro: this.usuarioService.UsuarioActual.idUsuario,
      descripcion: this.f.descripcion.value
    }
  }
}



