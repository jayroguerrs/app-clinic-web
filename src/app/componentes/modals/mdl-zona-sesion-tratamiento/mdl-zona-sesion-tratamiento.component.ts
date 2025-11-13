import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioService} from "../../../shared/services/usuario.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {ZonaSesionTratamiento, ZonaTratamiento} from "../../../shared/models/zonas";
import {ZonaTratamientoService} from "../../../shared/services/zona-tratamiento.service";
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgSelectConfig} from "@ng-select/ng-select";
import {ZonaSesionTratamientoService} from "../../../shared/services/zona-sesion-tratamiento.service";

@Component({
    selector: 'app-mdl-zona-sesion-tratamiento',
    templateUrl: 'mdl-zona-sesion-tratamiento.component.html'
})
export class MdlZonaSesionTratamientoComponent implements OnInit, OnDestroy {

    @Input() Zona: any;
    @Input() IdServicio: number;
    @Output() OnSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

    submitted: boolean;
    loading: boolean;

    tratamientos: ZonaTratamiento[] = [];
    sbcTratamientos: Subscription | undefined;
    ldTratamientos: boolean;

    formGroup: FormGroup;

    ldZonaTratamientos: boolean
    sbcZonaTratamientos: Subscription | undefined;
    collection: ZonaSesionTratamiento[] = [];

    constructor(
        private usuarioService: UsuarioService,
        public utilsService: UtilsService,
        private modal: NgbActiveModal,
        private zonaTratamientoService: ZonaTratamientoService,
        private formBuilder: FormBuilder,
        private config: NgSelectConfig,
        private api: ZonaSesionTratamientoService
    ) {
      this.config.notFoundText = 'No se encontraron resultados';

      this.submitted = false;
      this.loading = false;
      this.ldTratamientos = false;
      this.ldZonaTratamientos = false;

      this.formGroup = this.formBuilder.group({
        sesion: new FormControl(1, Validators.required)
      })
    }

    async ngOnInit(): Promise<void> {
      await this.listarTratamientos();
      await this.listarZonaTratamientos();
    }

    ngOnDestroy(): void {
    }

    initForm(): void {
    }

    patchForm(): void{
    }

    get model(): any {

        return {
          idZona: this.Zona.id,
          idUsuarioRegistro: this.usuarioService.UsuarioActual.idUsuario,
          tratamientos: this.collection.map(item => {
            return {
              idZona: item.idZona,
              sesion: item.sesion,
              idTratamientos: item.idTratamientos
            };
          })
        }

    }

    onSubmit(): void {
        this.submitted = true;
        this.loading = true;

        this.api.registrar(this.model).subscribe((res: boolean | ErrorSistema) => {
            if(res instanceof ErrorSistema){
              this.utilsService.mostrarToast(res.message, "error");
            }else{
              this.utilsService.mostrarToast("Se registraron con exito los tratamientos", "success");
            }
            this.OnSaved.emit(true);
            this.loading = false;
        }, error => {
          this.utilsService.mostrarToast("Ocurrio un error", "error");
          this.loading = false;
        });
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

    // data
    async listarTratamientos(): Promise<void>{
      this.ldTratamientos = true;
      this.sbcTratamientos = await this.zonaTratamientoService.listarByServicio(this.IdServicio, this.usuarioService.UsuarioActual.idUsuario).subscribe((res: ZonaTratamiento[] | ErrorSistema) => {
        if (res instanceof ErrorSistema) {
          this.utilsService.mostrarToast( res.message, 'error' );
        } else {
          console.log(this.tratamientos);
          this.tratamientos = res;
        }
        this.ldTratamientos = false;
      }, error => {
        this.utilsService.mostrarToast( 'Ocurrio un error al obtener los tratamientos', 'error' );
        console.log(error);
        this.ldTratamientos = false;
      });
    }

    async listarZonaTratamientos(): Promise<void>{
      this.ldZonaTratamientos = true;
      this.sbcZonaTratamientos = await this.api.collectionByZona(this.Zona.id, this.usuarioService.UsuarioActual.idUsuario).subscribe((res: ZonaSesionTratamiento[] | ErrorSistema) => {
        if (res instanceof ErrorSistema) {
          this.utilsService.mostrarToast( res.message, 'error' );
        } else {
          // console.log(this.tratamientos);
          console.log(res);
          this.collection = res;
        }
        this.ldZonaTratamientos = false;
      }, error => {
        this.utilsService.mostrarToast( 'Ocurrio un error al obtener los tratamientos registrados', 'error' );
        console.log(error);
        this.ldZonaTratamientos = false;
      });
    }

    /****************************************************************************************************
     * Getter
     */
    get f(): any{
      return this.formGroup.controls;
    }

    hasSelect(index: number): boolean{
      return !!this.collection.find(x => x.sesion === index);
    }

    /****************************************************************************************************
     * Events
     */
    evtOnAdd(): void{
        const model = new ZonaSesionTratamiento();
        model.idZona = this.Zona.id;
        model.sesion = parseInt( this.f.sesion.value, 10);

        if(this.collection.find(x => x.sesion === model.sesion)){
          this.utilsService.mostrarToast('La sesión ya se encuentra en la lista', 'warning');
          return;
        }

        this.collection.push(model);
        this.collection.sort((a: ZonaSesionTratamiento, b: ZonaSesionTratamiento) => {
          return (a.sesion - b.sesion);
        })
    }

    evtRemoveItem(index: number): void{
        this.collection = this.collection.filter((x,i) => i !== index);
    }

}
