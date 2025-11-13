import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {CitaService} from "../../../shared/services/cita.service";
import {Subscription} from "rxjs";
import { ErrorSistema } from 'src/app/shared/models/error-sistema';
import {UtilsService} from "../../../shared/services/funciones/utils.service";

@Component({
    selector: 'app-mdl-visualizar-taco',
  styleUrls: ['./mdl-visualizar-taco.scss'],
    templateUrl: 'mdl-visualizar-taco.component.html'
})
export class MdlVisualizarTacoComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('iframe', {static: false}) iframe: ElementRef | undefined;
    @ViewChild('pdfviewer', {static: false}) pdfViewer: ElementRef | undefined;

    @Input() urlData: string | null;
    @Input() IdCita: number;
    @Input() IdUsuario: number;
    @Input() total: number;
    @Input() citaEstado: string | undefined;
    @Input() idPerfil: number;

    @Input() urlVisualizar: string;
    @Input() mostrarPdfViewer = false;
    @Output() eventCitaListarPago: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventImprimirMobile: EventEmitter<boolean> = new EventEmitter<boolean>();

    windowWidth: number = window.innerWidth;
    isSmallScreen: boolean = this.windowWidth <= 1193;

    subscription: Subscription | undefined;
    loading = false;

    constructor(
        private modal: NgbActiveModal,
        private api: CitaService,
        private util: UtilsService
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
      // console.log(this.iframe?.nativeElement.contentWindow?.window);
      // (this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window?.addEventListener("beforeprint", (event) => {
      //   console.log("After print");
      // });
      // (this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window?.addEventListener("beforeprint", (event) => {
      //   console.log("After print");
      // });
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    imprimir(): void{
      //console.log(this.iframe?.nativeElement.contentWindow?.matchMedia('print'));
      // this.iframe?.nativeElement.addEventListener('afterprint', () => {
      //   console.log('Se imprimio');
      // });
      //
      //
      // this.iframe?.nativeElement.contentWindow?.window.addEventListener("afterprint", (event) => {
      //   console.log("After print");
      // });

      Swal.fire({
        html: `¿Desea imprimir el taco de cita?`,
        icon: 'question',
        allowOutsideClick: false,
        allowEscapeKey: false,
        buttonsStyling: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
          cancelButton: 'btn sbtn btn-light popins mr-2',
        },
        reverseButtons: true
      }).then(result => {
        if(result.isConfirmed) {
          
          this.subscription = this.api.marcarAtendida(this.IdCita, this.IdUsuario).subscribe((res: number | ErrorSistema) => {
            if(res instanceof ErrorSistema){
              this.util.mostrarToast(res.message, 'error');
            }else{
              (this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window.focus();
              (this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window.print();

              if(this.citaEstado !== 'PAGADO' && (this.idPerfil === 4 || this.idPerfil === 7 || this.idPerfil === 9 || this.idPerfil === 16 || this.idPerfil === 6)){
                const sendData = {
                  idCita: this.IdCita,
                  montoFinal: this.total,
                }
                this.eventCitaListarPago.emit(sendData);
              }

              if(this.isSmallScreen){
                this.eventImprimirMobile.emit(true);
              }
              // this.cerrarModal(true);
            }
          }, error => {
            console.log(error);
            this.util.mostrarToast('Ocurrio un error al intentar cambiar el estado a atendido', 'error');
          });
        }
      });
      //
      //
      // (this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window.focus();
      // (this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window.print();
      // console.log((this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window[0]);
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

    iframeLoad(iframe): void{
      console.log(iframe.contentDocument);
      console.log(iframe.contentWindow);
    }
}
