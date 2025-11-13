import { Component, OnInit, ViewChild } from '@angular/core';
import { BoxService } from '../../../shared/services/box.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MdlAddBoxComponent } from '../../modals/mdl-add-box/mdl-add-box.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-box-listado',
  templateUrl: './box-listado.component.html',
  styleUrls: ['./box-listado.component.scss', '../../cita/cita-registro/cita-registro.component.scss'],
})
export class BoxListadoComponent implements OnInit {
  mostrarListadoDeEspera: boolean = false;
  sedes: any[] = [];

  pisos = [];
  mdlPisos = [];
  pisoSeleccionado = 1;

  guardarBoxCreado: boolean = false;

  boxForm: FormGroup;

  sedeSeleccionada: number;

  imgPlanta: string

  @ViewChild('mdlAddBox') mdlAddBox: any;
  @ViewChild('mdlDetalleBox') mdlDetalleBox: any;

  mostrarBtnMaximize: boolean = false;
  testBox = [
    { id: 1,
      nombre: 'M1',
      idEstado: 1,
      positionTop: 64,
      positionLeft: 28,
    },
    { id: 2,
      nombre: 'M2',
      idEstado: 2,
      positionTop: 71.6,
      positionLeft: 41.6,
    }
  ];

  boxes: any[] = [];

  casillas: any[] = [];

  testClientes = [
    { id: 1, nombre: 'Cliente 1' },
    { id: 2, nombre: 'Cliente 2' },
    { id: 3, nombre: 'Cliente 3' },
    { id: 4, nombre: 'Cliente 4' },
    { id: 5, nombre: 'Cliente 5' },
    { id: 6, nombre: 'Cliente 6' },
    { id: 7, nombre: 'Cliente 7' },
    { id: 8, nombre: 'Cliente 8' },
    { id: 9, nombre: 'Cliente 9' },
    { id: 10, nombre: 'Cliente 10' },
    { id: 11, nombre: 'Cliente 11' },
    { id: 12, nombre: 'Cliente 12' },
    { id: 13, nombre: 'Cliente 13' },
    { id: 14, nombre: 'Cliente 14' },
    { id: 15, nombre: 'Cliente 15' },
    { id: 16, nombre: 'Cliente 16' },
    { id: 17, nombre: 'Cliente 17' },
    { id: 18, nombre: 'Cliente 18' },
    { id: 19, nombre: 'Cliente 19' },
    { id: 20, nombre: 'Cliente 20' },
    { id: 21, nombre: 'Cliente 21' },
    { id: 22, nombre: 'Cliente 22' },
    { id: 23, nombre: 'Cliente 23' },
    { id: 24, nombre: 'Cliente 24' },
    { id: 25, nombre: 'Cliente 25' },
    { id: 26, nombre: 'Cliente 26' },
    { id: 27, nombre: 'Cliente 27' },
    { id: 28, nombre: 'Cliente 28' },
    { id: 29, nombre: 'Cliente 29' }
  ]

  listadoClientes = [];

  mdlSedeSeleccionada: number;
  mdlPisoSeleccionado: number;
  constructor(
    private boxService: BoxService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.obtenerSedes();
    this.generarCasillas();

    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange);

    this.boxForm = new FormGroup({
      sede: new FormControl('', Validators.required),
      nombreBox: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      piso: new FormControl('', Validators.required)
    });
  }

  ngOnDestroy(): void {
    // Eliminar listeners cuando el componente se destruye
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);
  }

  handleFullscreenChange = () => {
    // Si NO hay elemento en pantalla completa, entonces salimos del modo
    if (!document.fullscreenElement && 
        !(document as any).webkitFullscreenElement && 
        !(document as any).mozFullScreenElement && 
        !(document as any).msFullscreenElement) {
      this.mostrarListadoDeEspera = false;
    }
  }

  generarCasillas(){
    this.casillas = Array(16).fill(null).map((_, i) => ({
      id: i + 1,
      nombre: `Casilla ${i + 1}`,
      ocupada: false
    }));
  }

  agregarACasilla(clienteId: number, clienteNombre: string, boxNombre: string): void {
    // Encuentra la primera casilla libre
    const casillaLibre = this.casillas.find(c => !c.ocupada);
    if (casillaLibre) {
      casillaLibre.ocupada = true;
      casillaLibre.clienteId = clienteId;
      casillaLibre.clienteNombre = clienteNombre;
      casillaLibre.boxNombre = boxNombre;
      casillaLibre.pulsante = true
    } else {
      console.log('No hay casillas disponibles');
    }
  }

  agregarACasillaDos(clienteId: number, clienteNombre: string, boxNombre: string): void {
    // Encuentra la primera casilla libre
    const casillaLibre = this.casillas.find(c => !c.ocupada);
    if (casillaLibre) {
      casillaLibre.ocupada = true;
      casillaLibre.clienteId = clienteId;
      casillaLibre.clienteNombre = clienteNombre;
      casillaLibre.boxNombre = boxNombre;
      casillaLibre.pulsante = false

    } else {
      console.log('No hay casillas disponibles');
    }
  }

  obtenerSedes(){
    this.boxService.getSedes().subscribe((data: any) => {
      this.sedes = data;
    });
  }

  onPisoChange(event: any) {
    this.boxService.getPlanta(this.sedeSeleccionada, this.pisoSeleccionado).subscribe((data: any) => {
      this.imgPlanta = data.imgPlanta;
      this.boxes = data.boxes || [];
      this.listarListadoDeEspera();
      // console.log(data, "fatttttttttttttttttttttttttt")
      // console.log('Piso seleccionado:', this.pisoSeleccionado);
    })
  }

  showMdlAddBox(){
    this.mdlAddBox.show();
  }

  showMdlDetalleBox(){
    this.mdlDetalleBox.show();
  }

  toggleFullScreen(element: HTMLElement) {

    if (!document.fullscreenElement) {
      this.mostrarListadoDeEspera = true;
      // Si no está en pantalla completa, solicita que entre en modo pantalla completa
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) { // Firefox
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) { // Chrome, Safari y Opera
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) { // IE/Edge
        (element as any).msRequestFullscreen();
      }
    } else {
      this.mostrarListadoDeEspera = false;
      // Si ya está en pantalla completa, sale de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) { // Firefox
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) { // Chrome, Safari y Opera
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) { // IE/Edge
        (document as any).msExitFullscreen();
      }
    }
  }

  onSedeChange(event: any) {
    this.pisoSeleccionado = 1;
    this.pisos = this.sedes.find(sede => sede.idSede === event.value)?.pisos || [];
    this.onPisoChange(true); 
    this.listarListadoDeEspera();
  }

  mdlOnSedeChange(event: any) {
    const selectedValue = Number(event.target.value); // Convertir a número
    this.mdlPisos = this.sedes.find(sede => sede.idSede === selectedValue)?.pisos || [];
    console.log(this.mdlPisos, 'mdlPisos');
  }

  obtenerPosicionClick(event: MouseEvent) {
    const img = event.target as HTMLImageElement;
    const rect = img.getBoundingClientRect();

    // Coordenadas absolutas del click dentro de la imagen
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Porcentaje respecto al tamaño de la imagen
    const leftPercent = (x / rect.width) * 100;
    const topPercent = (y / rect.height) * 100;

    const nuevoBox = 
    { 
      id: 3,
      nombre: 'M3',
      idEstado: 1,
      positionTop: +topPercent.toFixed(2),
      positionLeft: +leftPercent.toFixed(2),
    }
    this.testBox.push(nuevoBox);
    console.log( +topPercent.toFixed(2),+leftPercent.toFixed(2));
    console.log('Top:', +topPercent.toFixed(2) + '%', 'Left:', +leftPercent.toFixed(2) + '%');
    // Puedes usar estos valores para crear un nuevo box o lo que necesites
  }

  verPosiciones(){
    console.log(this.testBox, 'testBox');
  }
  onBoxDragEnd(event: any, box: any) {
    // Obtén el contenedor padre del elemento arrastrado
    const parentElement = event.source.element.nativeElement.parentElement;

    // Obtén el rectángulo del contenedor (esto te da la posición de su borde superior e izquierdo)
    const parentRect = parentElement.getBoundingClientRect();

    // Obtén el rectángulo del box (el objeto que estamos arrastrando)
    const boxElement = event.source.element.nativeElement;
    const boxRect = boxElement.getBoundingClientRect();

    // Agregamos logs para depurar
    console.log('Rectángulo del contenedor:', parentRect);
    console.log('Rectángulo del box:', boxRect);

    // Calcular la diferencia entre la posición del box y la del contenedor
    const leftOffset = boxRect.left - parentRect.left;
    const topOffset = boxRect.top - parentRect.top;

    // Agregamos logs para depurar el cálculo de las posiciones
    console.log('Offset Left:', leftOffset);
    console.log('Offset Top:', topOffset);

    // Calcular el porcentaje de las posiciones (con respecto al tamaño del contenedor)
    const leftPercent = (leftOffset / parentRect.width) * 100;
    const topPercent = (topOffset / parentRect.height) * 100;

    // Agregamos logs para ver el cálculo final-----------------------
    console.log('Left en porcentaje:', leftPercent);
    console.log('Top en porcentaje:', topPercent);

    // **Reemplazamos las posiciones actuales por las nuevas calculadas en porcentaje**
    box.positionLeft = leftPercent;  // Ahora es directamente el porcentaje calculado
    box.positionTop = topPercent;    // Igual para la posición top

    // Elimina cualquier transformación previa que pueda interferir
    boxElement.style.removeProperty('transform');

    // Asegúrate de que el estilo `top` y `left` se establezcan correctamente
    boxElement.style.top = `${topPercent}%`;
    boxElement.style.left = `${leftPercent}%`;

    // Aseguramos que las posiciones se estén guardando correctamente
    console.log(`Posición final para el box ${box.nombre}: Top = ${box.positionTop}%, Left = ${box.positionLeft}%`);
  }


  getDragPosition(box: any): { x: number, y: number } {
    const container = document.querySelector('.drag-area') as HTMLElement;
    if (!container) return { x: 0, y: 0 };
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    return {
      x: (box.positionLeft / 100) * width,
      y: (box.positionTop / 100) * height
    };
  }

  crearBox(){
    if (this.boxForm.valid) {
      this.guardarBoxCreado = true;
      // Usar los valores del formulario para crear el box
      const formValues = this.boxForm.value;
      
      this.sedeSeleccionada = formValues.sede;
      this.pisoSeleccionado = formValues.piso;

      this.pisos = this.sedes.find(sede => sede.idSede === this.sedeSeleccionada)?.pisos || [];
      this.onPisoChange(true); 

      // Crear nuevo box con valores dinámicos
      const nuevoBox = { 
        id: this.testBox.length + 1,
        nombre: formValues.nombreBox, 
        idEstado: 1,
        positionTop: 12.25,
        positionLeft: 2.34,
        creado: true, 
      };
      
      this.testBox.push(nuevoBox);
      this.boxForm.reset();
      this.mdlAddBox.hide();
    } else {
      console.log('Formulario inválido. Por favor, complete todos los campos requeridos.');
    }
  }

  soloNumeros(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  modalRef: NgbModalRef | undefined;
  
  abrirModalAddBox() {
    this.modalRef = this.modalService.open(MdlAddBoxComponent, { size: 'md', windowClass: 'bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.modalRef.componentInstance.modal = this.modalRef;
  }

  listarListadoDeEspera(){
    this.boxService.getListadoDeEspera(this.sedeSeleccionada, this.pisoSeleccionado).subscribe((data: any) => {
      console.log(data, "esperaaaaaaaaaaaaaaaaaaaa**************")
    });
  }

  usuarioScanea(){

  }

  mockBoxAtendiendo(){
    const indexAtendido = this.casillas.findIndex(box => box.boxNombre === 'M3');
    if (indexAtendido !== -1) {
      this.casillas.splice(indexAtendido, 1);
    }

    const indexBox = this.boxes.findIndex(box => box.nombre === 'M3');
    if (indexAtendido !== -1) {
      this.boxes[indexBox].idEstado = 3;
    }
    console.log(this.boxes, "casilllaaaaaaaaaaaaaaa")
  }

}
