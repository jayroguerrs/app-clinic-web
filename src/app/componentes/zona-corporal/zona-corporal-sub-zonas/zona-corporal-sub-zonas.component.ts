import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {Usuario} from '../../../shared/models/usuario';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {UtilsService} from '../../../shared/services/funciones/utils.service';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import {ZonaCorporalService} from "../../../shared/services/zona-corporal.service";
import {DocumentoTipoPerfil} from "../../../shared/models/documento";

@Component({
    selector: 'app-zona-corporal-sub-zonas',
    templateUrl: 'zona-corporal-sub-zonas.component.html'
})
export class ZonaCorporalSubZonasComponent implements OnInit, OnDestroy {

    @Input() modal: NgbModalRef;
    @Input() zona: any | null = null;

    formGroup: FormGroup;
    usuarioActual: Usuario;

    submitted = false;

    // Subscription
    subscriptionForm : Subscription;
    subscriptionZonas: Subscription;
    sbcCollectionZonas: Subscription;

    // Zonas para sub-zonas - autocomplete
    public zonas: Array<{id: string, text: string}>;
    public subZonasSeleccionadas: Array<{id: string, text: string}> = [];
    public subZonaSearchControl = new FormControl('');
    public zonasFiltradasObservable: Observable<Array<{id: string, text: string}>>;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private utilsService: UtilsService,
        private zonaCorporalService: ZonaCorporalService
    ) {
      this.zonas = [];
      if (this.zona){
        console.log('Zona seleccionada');
        this.buscarSubZonas();
      }
    }

    ngOnInit(): void {

      // console.log('modelo', this.model);
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.inicializarFormulario();
        this.listarZonas();
        this.configurarAutocomplete();
        if(this.zona){
            this.buscarSubZonas();
        }
    }

    ngOnDestroy(): void {
      // Destroy Subscription
      if(this.subscriptionForm){ this.subscriptionForm.unsubscribe() }
      if(this.subscriptionZonas){ this.subscriptionZonas.unsubscribe() }
      if(this.sbcCollectionZonas){ this.sbcCollectionZonas.unsubscribe() }
    }

    inicializarFormulario(): void {
        this.formGroup = this.formBuilder.group({
          zonas: new FormControl([])
        });
    }

    listarZonas(): void{

      this.sbcCollectionZonas = this.zonaCorporalService.obtenerZonasParaSubZonas( this.zona.id  ).subscribe((res) => {

        const zonas: Array<{id: string, text: string}> = [];
        res.forEach((p: any) => {
          const zona = {
            id: p.id,
            text: p.descripcion
          };
          zonas.push(zona);
        });

        this.zonas = zonas;
        // console.log(perfiles);

      });
    }

    buscarSubZonas(): void {
      this.subscriptionZonas = this.zonaCorporalService.obtenerSubZonasById( this.zona.id ).subscribe(
        ( res: any[]) => {
          const ids: string[] = [];
          res.forEach((item)=> {
            // console.log('item', item);
            ids.push(item.id.toString());
          });
          this.formGroup.setValue({
            zonas: ids
          });
          
          // Cargar sub-zonas seleccionadas para el autocomplete
          this.subZonasSeleccionadas = this.zonas.filter(zona => ids.includes(zona.id));
          // console.log(this.formGroup.controls.zonas.value);
        }
      );
    }

    get f(): any { return this.formGroup.controls; }

    onSubmit(): void {
        this.submitted = true;

        const id = this.zona.id;
        const subzonas: number[] = this.subZonasSeleccionadas.map(z => parseInt(z.id));
        // console.log( 'subzonas seleccionadas', subzonas );

        this.subscriptionForm = this.zonaCorporalService.asignarSubZonas(this.zona.id, subzonas).subscribe(
           resultado => {
                // console.log('asignar subzona', resultado);
                console.log('%c✓ Se asignaron las zonas correctamente !!!', 'color:#a5dc86');
                Swal.fire({title:'Se asignaron las subzonas correctamente !!!', icon: 'success'});
                this.cerrarModal(true);
           },
           error => {
             console.log('Error al asignar sub zonas', error);
             this.utilsService.mostrarToast(error.message + ': ' + error.code, 'error');
           }
        );
    }
    cerrarModal( result: boolean = false ): void {
        this.modal.close(result);
    }

    // Métodos para el autocomplete de sub-zonas
    configurarAutocomplete(): void {
      this.zonasFiltradasObservable = this.subZonaSearchControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filtrarZonas(typeof value === 'string' ? value : ''))
      );
    }

    private filtrarZonas(valor: string): Array<{id: string, text: string}> {
      if (!valor) return this.zonas.filter(zona => !this.subZonasSeleccionadas.find(sel => sel.id === zona.id));
      
      const filtroTexto = valor.toLowerCase();
      return this.zonas.filter(zona => 
        zona.text.toLowerCase().includes(filtroTexto) && 
        !this.subZonasSeleccionadas.find(sel => sel.id === zona.id)
      );
    }

    seleccionarSubZona(event: MatAutocompleteSelectedEvent): void {
      const subZonaSeleccionada = event.option.value;
      
      if (subZonaSeleccionada && !this.subZonasSeleccionadas.find(z => z.id === subZonaSeleccionada.id)) {
        this.subZonasSeleccionadas.push(subZonaSeleccionada);
        this.actualizarFormControl();
      }
      
      // Limpiar el input
      this.subZonaSearchControl.setValue('');
    }

    removerSubZona(zona: {id: string, text: string}): void {
      const index = this.subZonasSeleccionadas.findIndex(z => z.id === zona.id);
      if (index >= 0) {
        this.subZonasSeleccionadas.splice(index, 1);
        this.actualizarFormControl();
      }
    }

    private actualizarFormControl(): void {
      // Actualizar el FormControl con los IDs seleccionados
      const idsSeleccionados = this.subZonasSeleccionadas.map(z => z.id);
      this.formGroup.get('zonas')?.setValue(idsSeleccionados);
    }

}
