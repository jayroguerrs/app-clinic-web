import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AnuncioService } from '../../../shared/services/anuncio.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-anuncio-datos',
  templateUrl: './anuncio-datos.component.html',
  styleUrls: ['./anuncio-datos.component.scss']
})
export class AnuncioDatosComponent implements OnInit {
  @Input() id: number;
  @Input() modal: NgbModalRef;
  frmAnuncioDatos: FormGroup;
  usuarioActual: Usuario;
  accion = '';
  archivoImagenAnuncio: File = null;
  rutaImagenAnuncio: any; // '../../../../assets/images/alumno.png';
  constructor(
    private anuncioService: AnuncioService,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.frmAnuncioDatos = this.formBuilder.group({
      idAnuncio: [0],
      titulo: [''],
      informacion: [''],
      imagen: ['']
    });
  }
  getImagen(imagen: string): any{
    return '';
  }
  cerrarModal(): void {
    this.modal.close();
  }
  anuncioGrabar(): void {
    this.anuncioService.guardar(this.anuncio).subscribe(
      resultado => {
        this.utilsService.mostrarToast(resultado.mensaje, 'success');
        this.cerrarModal();
      }
    );
  }
  get anuncio(): any{
    const modal = {
      id: this.id,
      titulo: this.frmAnuncioDatos.controls.titulo.value,
      informacion: this.frmAnuncioDatos.controls.informacion.value,
      imagen: this.rutaImagenAnuncio,
      usuarioRegistra: this.usuarioActual.nombre,
      usuarioEdita: this.usuarioActual.nombre
    };
    return modal;
  }

  mostrarFotoAnuncio(file: FileList) {
    this.archivoImagenAnuncio = file.item(0);
    const reader = new FileReader();
    reader.onload = event => this.rutaImagenAnuncio = event.target.result;
    reader.readAsDataURL(this.archivoImagenAnuncio);
  }

}
