import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subject, Subscription} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {PreferenteService} from "../../../shared/services/preferente.service";
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-mdl-buscar-preferente',
  templateUrl: './mdl-buscar-preferente.component.html',
  styleUrls: ['./mdl-buscar-preferente.component.scss']
})
export class MdlBuscarPreferenteComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @Output() OnEdit: EventEmitter<number> = new EventEmitter<number>();

  typesDate: any[] = [
    {
      id: 1,
      name: 'Mes Actual'
    },
    {
      id: 2,
      name: 'Rango Fecha'
    }
  ];

  typesUsu: any[] = [
    {
      id: 1,
      name: 'Usu. Facebook'
    },
    {
      id: 2,
      name: 'Usu. Instagram'
    }
  ];

  typeDate: any = this.typesDate[0];
  typeUsu: any = this.typesUsu[0];

  formGroup: FormGroup;
  loading: boolean;
  subscriptions: Subscription[] = [];
  usuType: 1 | 2 = 1;
  $usuType: Subject<any>;
  $typeDate: Subject<number>;
  submitted: boolean;

  collection: any[] = [];

  optionsTable = {};

  init: boolean;
  dataTable: any;

  selected: any | null = null;

  constructor(
    public modal: NgbActiveModal,
    public api: PreferenteService,
    public utilsService: UtilsService,
    public formBuilder: FormBuilder,
    public datePipe: DatePipe
  ) {
    this.loading = false;
    this.submitted = false;
    this.init = false;
    this.$usuType = new Subject<any>();
    this.$typeDate = new Subject<any>();
  }

  ngOnInit(): void {

    this.buildtable();

    const today = new Date();

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl( this.datePipe.transform(today,'yyyy-MM-dd'), Validators.required ),
      fechaHasta: new FormControl( this.datePipe.transform(today,'yyyy-MM-dd'), Validators.required ),
      usuFacebook: new FormControl(null, Validators.required),
      usuInstagram: new FormControl(null)
    });

    this.$usuType.subscribe((v: any) => {
      this.typeUsu = v;
      this.typeUsu = v;

      this.f.usuFacebook.clearValidators();
      this.f.usuInstagram.clearValidators();
      this.formGroup.patchValue({
        usuFacebook: null,
        usuInstagram: null
      });

      if(v.id === 1){
        this.f.usuFacebook.setValidators(Validators.required);
      }else{
        this.f.usuInstagram.setValidators(Validators.required);
      }

      this.f.usuFacebook.updateValueAndValidity();
      this.f.usuInstagram.updateValueAndValidity();
    });


    this.$typeDate.subscribe((v: any) => {
      this.typeDate = v;
      this.f.fechaDesde.clearValidators();
      this.f.fechaHasta.clearValidators();
      this.formGroup.patchValue({
        fechaDesde: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        fechaHasta: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      });

      if(v.id === 2){
        this.f.fechaDesde.setValidators(Validators.required);
        this.f.fechaHasta.setValidators(Validators.required);
      }
      this.f.usuFacebook.updateValueAndValidity();
      this.f.usuInstagram.updateValueAndValidity();
    });

  }

  ngAfterViewInit(): void {

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.dataTable = dtInstance;

      dtInstance.on('deselect',  (e, dt, type, indexes ) => {
        this.selected = null;
      });

      dtInstance.on('select',  (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          this.selected =  dtInstance.rows('.selected').data()[0];
        }
      });

    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cerrarModal( result: boolean = false ): void {
    this.modal.close(result);
  }

  /***
   * Getters
   */
  get f(): any{
    return this.formGroup.controls;
  }

  get model(): any{
    return {
      dateTipo: this.typeDate.id,
      tipo: this.typeUsu.id,
      fechaDesde: this.f.fechaDesde.value ? this.datePipe.transform(this.f.fechaDesde.value, 'yyyy-MM-dd') : null,
      fechaHasta: this.f.fechaHasta.value ? this.datePipe.transform(this.f.fechaHasta.value, 'yyyy-MM-dd') : null,
      usuario: this.typeUsu.id === 1 ? this.f.usuFacebook.value : this.f.usuInstagram.value
    }
  }

  /***
   * Events
   */

  evtBuscar(): void{
    this.init = true;
    this.submitted = true;
    this.loading = true;

    if(this.formGroup.invalid){
      this.utilsService.mostrarToast('Debe llenar todos los campos', 'warning');
      return;
    }

    this.dataTable.ajax.reload();
  }

  evtChangeType(type: 1 | 2): void{
    this.$usuType.next(type);
  }

  evtChangeDateType(type: 1 | 2): void{
    const $type = this.typesDate.find(t => t.id === type);
    if(this.typeDate !== $type){
      this.$typeDate.next($type);
    }
  }

  evtChangeUsuType(type: 1 | 2): void{
    const $type = this.typesUsu.find(t => t.id === type);
    if(this.typeUsu !== $type){
      this.$usuType.next($type);
    }
  }

  evtEditar(): void{
      this.OnEdit.emit(this.selected.id);
  }

  /***
   * Functions
   */
  buildtable(): void {
    this.optionsTable = {
      ajax: (dataTablesParameters: any, callback) => {

        if(this.init){
          const subs = this.api.buscarPreferente(this.model).subscribe(
            (data: any[]) => {
              this.collection = data;
              callback({ data  });
            },
            error =>  {
              console.log('Error al buscar el preferente', error);
              callback({ data: []  });
            }
          );
          this.subscriptions.push(subs)
        }else{
          callback({ data: []  });
        }

      },
      select: {
        selector: 'td:not(:first-child)'
      },
      searching: true,
      'columnDefs': [{
        'max-width': '34px',
        'targets': 0
      }],
      columns: [
        {
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        { title: 'ID', width: '0', data: 'id', visible: false },
        { title: 'PREFERENTE', width: '10%', data: 'nombres' },
        { title: 'ESTADO', width: '10%', data: 'idEstado', render(data): any{
            switch (data){
              case 1: return '<span class="label theme-bg-red">SIN ASIGNAR</span>';
              case 2: return '<span class="label theme-bg-yellow f-12">ASIGNADO</span>';
              case 3: return '<span class="label theme-bg-green f-12">VISTO</span>';
              case 4: return '<span class="label theme-bg-black f-12" style="color: white;">TRABAJADO</span>';
              default: return '<span class="label bg-indigo">SIN NÚMERO</span>';
            }
          }
        },
        // { title: 'A. CATEGORIA',  data: 'atencionCategoria' },
        // { title: 'A. OPCIÓN', data: 'atencionOpcion' },
        { title: 'CLIENTE', data: 'esCliente', render(data): any{
            switch (data){
              case 0: return '<span class="label theme-bg-red">NO</span>';
              case 1: return '<span class="label theme-bg-green">SI</span>';
            }
          }
        },
        { title: 'ATENCION', width: '5%', data: 'estadoAtencion' },
        { title: 'CELULAR', width: '5%', data: 'celular' },
        { title: 'ZONA', width: '5%', data: 'zonaCorporal' },
        { title: 'TELEOPERADORA',  width: '"5%', data: 'teleoperadora', render: (data, xhr, row) => {
            return `<span title="${row.nombreTeleoperador}">${data}</span>`
          }},
        { title: 'CORREO', width: '5%', data: 'email' },
        { title: 'CONTACTO', width: '5%', data: 'medioContacto' },
        { title: 'DISTRITO', width: '5%', data: 'distrito' },
        { title: 'OBSERVACION', width: '5%', data: 'observacion', render: (data: string[]) =>{
            let output = '<ul class="mb-0 pl-0">';
            data.forEach(x => {
              output += `<li>${x}</li>`;
            });
            output += '</ul>';

            return data.length ? output : '';
          }},
        { title: 'COMENTARIO', width: '5%', data: 'comentario' },
        { title: 'OBSERVACION', width: '5%', data: 'observacion', visible: false , render: (data: string[]) =>{
            return data.join(' | ');
          }},
        { title: 'USU. FACEBOOK', data: 'usuFacebook' },
        { title: 'USU. INSTAGRAM', data: 'usuInstagram' },
        { title: 'UTM FUENTE', data: 'utmSource' },
        { title: 'UTM MEDIO', data: 'utmMedium' },
        { title: 'UTM CAMPAÑA',  data: 'utmCampaign' },
        { title: 'UTM ID',  data: 'utmId' },
        { title: 'UTM TERM',  data: 'utmTerm' },
        { title: 'FEC. INGR.', data: 'fechaRegistra' , render: (data: string) =>{
            return this.datePipe.transform( new Date(data), 'dd/MM/yyyy');
          }},
        { title: 'HORA INGR.', data: 'fechaRegistra', render: (data: string) =>{
            return this.datePipe.transform( new Date(data), 'hh:mm a');
          }},
        { title: 'U. REG', data: 'usuarioRegistro' },
        { title: 'FEC. ASIG.',  data: 'fechaAsignacion' },
      ],
      serverSide: false,
      processing: false,
      async: true,
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function ( api, rowIdx, columns: any[] ) {
            const data = columns.map( x => {
              return x.hidden ?
                '<tr data-dt-row="'+x.rowIndex+'" data-dt-column="'+x.columnIndex+'">'+
                '<td><b>'+x.title+'</b></td>'+
                '<td><b>:</b></td>'+
                '<td>'+x.data+'</td>'+
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100','table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      },
      order: []
    };
  }

}
