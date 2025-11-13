import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WebcamImage } from 'ngx-webcam';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { NestjsUploadFilesService } from '../../../shared/services/nestjs-upload-files.service';
import { catchError, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { CitaService } from '../../../shared/services/cita.service';

@Component({
  selector: 'app-mdl-fotos-parametros-cita',
  templateUrl: './mdl-fotos-parametros-cita.component.html',
  styleUrls: ['./mdl-fotos-parametros-cita.component.scss']
})
export class MdlFotosParametrosCitaComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() clienteId: number;
  @Input() servicioId: number;
  @Input() zonaId: number;
  @Input() sesion: number;
  @Input() tieneParametro : boolean = false;

  @Input() citaDetalleId: number;


  @Output() listarImgs: EventEmitter<void> = new EventEmitter();
  @Output() addParametro: EventEmitter<void> = new EventEmitter();

  private trigger: Subject<void> = new Subject<void>();

  urlTest: string = ''

  imagenesTomadas: string[] = [];
  imagenSeleccionada: string | null = null;


  constructor(
    private citaService: CitaService,
    private nestjsUploadFilesService: NestjsUploadFilesService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
  ) { } 

  ngOnInit(): void {
  }

  guardarFotos(){
    this.spinner.show();
    const imageUrls: string[] = [];

    const archivos = this.convertirBase64AArchivos(this.imagenesTomadas);

    const requests = archivos.map((archivo, index) => {
      const formData = new FormData();
      formData.append('file', archivo, `imagen_${index}.jpg`);

      return this.nestjsUploadFilesService.uploadImage(formData).pipe(
        map((resp: any) => {
          if (resp && resp.url) {
            imageUrls.push(resp.url); 
          }
        }),
        catchError((error) => {
          console.error(`Error al subir la imagen ${index}:`, error);
          return of(null);
        })
      );
    });

    forkJoin(requests).subscribe(() => {
      const postData = {
        session: this.sesion,
        customerId: this.clienteId,
        serviceId: this.servicioId,
        zoneId: this.zonaId,
        images: imageUrls 
      };

      if(!this.tieneParametro && this.citaDetalleId !== 0){
        this.actualizarParametro();
      }

      if(!this.tieneParametro && this.citaDetalleId === 0){
        this.addParametro.emit();
      }
      // Hacer el segundo POST con el objeto
      this.nestjsUploadFilesService.saveImageParametrosGroup(postData).subscribe((response) => {
        this.spinner.hide();
        Swal.fire({
          title: 'Imagenes subidas!!!',
          html: 'Las imagenes se subieron correctamente!!!',
          icon: 'success',
        })

        this.listarImgs.emit();
        this.modal.close(false);
      }, (error) => {
        this.utilsService.mostrarToast('No se pudo subir las imagenes!', 'error');
        this.spinner.hide();
        console.error('Error al hacer el segundo POST:', error);
      });

      // Cerrar el modal después de que todo se haya completado
      this.modal.close(false);
    });

  }

  actualizarParametro(){
    const parametroUpdate = {
      idCitaDetalle: this.citaDetalleId,
      parametro : "|",
    }

    this.citaService.actualizarParametros(parametroUpdate).subscribe((resp: any) => {})
  }

  convertirBase64AArchivos(imagenesBase64: string[]): File[] {
    return imagenesBase64.map(base64 => {
      const byteString = atob(base64.split(',')[1]); // Decodificar base64
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convertir base64 a bytes
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      
      // Crear un Blob
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      
      // Convertir Blob a File
      return new File([blob], 'imagen.jpg', { type: 'image/jpeg' });
    });
  }

  cerrarModal(output: boolean = false): void {
    if(this.imagenesTomadas.length === 0) {
      this.modal.close(output);
    } else{
      Swal.fire({
        title: "¿Estás seguro de cerrar?",
        html: `Aún tienes fotos sin guardar.<br>
        <span style="color: gray; font-size: 0.9em;">
        (Si no deseas conservarlas, puedes cerrar esta ventana)
        </span>`,
        
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, Salir!",
        cancelButtonText: "No, Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.modal.close(output);
        }
      });
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }
  
  handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.urlTest = webcamImage.imageAsDataUrl;
    this.imagenesTomadas.unshift(webcamImage.imageAsDataUrl);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  quitarImagen(index: number){
    this.imagenesTomadas.splice(index, 1);
  }

  abrirImagen(img: string) {
    this.imagenSeleccionada = img;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

}
