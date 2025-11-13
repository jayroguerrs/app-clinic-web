import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Usuario} from '../../../shared/models/usuario';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {UtilsService} from '../../../shared/services/funciones/utils.service';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {DocumentoTipoService} from "../../../shared/services/documento-tipo.service";
import {DocumentoTipo, DocumentoTipoPerfil} from "../../../shared/models/documento";
import { Subscription } from 'rxjs';
import { AutocompleteOption, AutocompleteConfig, AutocompleteSelectionEvent } from '../../../shared/components/autocomplete-select';
import {PerfilService} from "../../../shared/services/perfil.service";

@Component({
    selector: 'app-tipo-documento-perfiles',
    templateUrl: 'tipo-documento-perfiles.component.html'
})
export class TipoDocumentoPerfilesComponent implements OnInit, OnDestroy {

    @Input() modal: NgbModalRef;
    @Input() model: DocumentoTipo | null;
    @Output() eventListar: EventEmitter<boolean> = new EventEmitter<boolean>();

    formGroup: FormGroup;
    usuarioActual: Usuario;

    submitted = false;

    // Subscription
    subscriptionForm : Subscription;
    subscriptionProfiles: Subscription;
    sbcCollectionPerfiles: Subscription;



    // Autocomplete
    public perfilesOptions: AutocompleteOption[] = [];
    public autocompleteConfig: AutocompleteConfig = {
        placeholder: 'Seleccionar perfiles...',
        label: 'Perfiles',
        multiple: true,
        useChips: true,
        searchable: true,
        clearable: true,
        emptyMessage: 'No hay perfiles disponibles'
    };

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private utilsService: UtilsService,
        private perfilService: PerfilService,
        private documentoTipoService: DocumentoTipoService
    ) {
    }

    ngOnInit(): void {

        // console.log('modelo', this.model);
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.inicializarFormulario();
        this.listarPerfiles();
        if(this.model){
            this.buscarPerfiles();
        }

    }

    ngOnDestroy(): void {
      // Destroy Subscription
      if(this.subscriptionForm){ this.subscriptionForm.unsubscribe() }
      if(this.subscriptionProfiles){ this.subscriptionProfiles.unsubscribe() }
      if(this.sbcCollectionPerfiles){ this.sbcCollectionPerfiles.unsubscribe() }
    }

    inicializarFormulario(): void {
        this.formGroup = this.formBuilder.group({
          perfiles: new FormControl([])
        });
    }

    listarPerfiles(): void{
      this.sbcCollectionPerfiles = this.perfilService.obtener().subscribe((res) => {
        const perfilesAutocomplete: AutocompleteOption[] = [];
        
        res.forEach((p: any) => {
          const perfilAutocomplete: AutocompleteOption = {
            id: p.idPerfil.toString(),
            text: p.nombre,
            icon: 'account_circle'
          };
          perfilesAutocomplete.push(perfilAutocomplete);
        });

        this.perfilesOptions = perfilesAutocomplete;
        console.log('Perfiles autocomplete:', this.perfilesOptions);

      });
    }
    buscarPerfiles(): void {
        this.subscriptionProfiles = this.documentoTipoService.getProfilesById(this.model?.id).subscribe(
          ( res: DocumentoTipoPerfil[]) => {
              const ids: string[] = [];
              res.forEach((res)=> {
                ids.push(res.id.toString());
              });
              this.formGroup.setValue({
                perfiles: ids
              });
            }
        );
    }

    get f(): any { return this.formGroup.controls; }


    onSubmit(): void {
        this.submitted = true;

        const id = this.model.id;
        const profiles: number[] = this.formGroup.controls.perfiles.value.map((val) => {return parseInt(val)});

        this.subscriptionForm = this.documentoTipoService.assignProfiles(this.model.id, profiles).subscribe(
           resultado => {
             // console.log(resultado);
                Swal.fire({title:'Se asignaron los perfiles al documento!!!', icon: 'success'});
                this.cerrarModal(true);
           },
           error => {
             console.log('Error al asignar perfiles al documento', error);
             this.utilsService.mostrarToast(error.message + ': ' + error.code, 'error');
           }
        );
    }
    cerrarModal( result: any | null = null): void {
        this.modal.close(result);
    }

    // Método para manejar la selección del autocomplete
    onPerfilesSelected(event: AutocompleteSelectionEvent): void {
        console.log('Perfiles seleccionados:', event.allSelected);
        const selectedIds = event.allSelected.map(option => option.id.toString());
        this.formGroup.patchValue({
            perfiles: selectedIds
        });
    }

}
