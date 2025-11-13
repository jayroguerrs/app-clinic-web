import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreferenteClienteComponent} from "./preferente-cliente.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../../theme/shared/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {TagInputModule} from "ngx-chips";
import {CellMaskDirectiveModule} from "../../../shared/directive/cell-mask.directive";
import {NgxSpinnerModule} from "ngx-spinner";
import {SafeHtmlPipe} from "../../../shared/pipe/safe-html.pipe";



@NgModule({
  declarations: [PreferenteClienteComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatRippleModule,
    FontawesomeSvgModule,
    DataTablesModule,
    MatInputModule,
    MatButtonModule,
    NgbTooltipModule,
    TagInputModule,
    CellMaskDirectiveModule,
    NgxSpinnerModule,
  ],
  exports: [PreferenteClienteComponent],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [PreferenteClienteComponent]
})
export class PreferenteClienteModule { }
