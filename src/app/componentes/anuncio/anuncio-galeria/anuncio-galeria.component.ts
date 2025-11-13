import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { AnuncioService } from '../../../shared/services/anuncio.service';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-anuncio-galeria',
  templateUrl: './anuncio-galeria.component.html',
  styleUrls: ['./anuncio-galeria.component.scss']
})
export class AnuncioGaleriaComponent implements OnInit {
  modalAnuncioDatosRef: NgbModalRef;
  id = 0;
  anuncios = [];

  imagenVer : any;
  tituloVer: string;
  informacionVer: string;

  // Permisos
  accTot: boolean = false; 
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;
  constructor(
    private utilsService: UtilsService,
    private anuncioService: AnuncioService,
    private permisoHelper: PermisoHelper
  ) { }

  ngOnInit(): void {
    this.anuncioListar();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;  
      this.accCrud = accesos.accCrud;    
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;  
    });
  }

  anuncioNuevo(modal: any): void {
    this.id = 0;
    this.modalAnuncioDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalAnuncioDatosRef.result.then(result => this.anuncioListar());
  }

  anuncioListar(): void {
    this.anuncioService.obtener().subscribe(
      resultado => {
        return this.anuncios = resultado;
      });
  }

  anuncioEditar(modal: any): void{
    this.modalAnuncioDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalAnuncioDatosRef.result.then(result => this.anuncioListar());
  }

  verAnuncio(modal: any, anuncio): void {
    this.imagenVer = anuncio.imagen;
    this.tituloVer = anuncio.titulo;
    this.informacionVer = anuncio.informacion;
    this.modalAnuncioDatosRef = this.utilsService.abrirModal(modal, 'xl');
  }
}