import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRippleModule} from "@angular/material/core";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";

import localesEs from '@angular/common/locales/es';
import { registerLocaleData } from "@angular/common";
import {MdlPdfGoogleViewComponent} from "./mdl-pdf-google-view.component";
import {SafepipeModule} from "../../../shared/pipe/safepipe/safepipe.module";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import { PdfViewerModule } from 'ng2-pdf-viewer';
registerLocaleData(localesEs, 'es');

@NgModule({
  declarations: [
    MdlPdfGoogleViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatRippleModule,
    NgbModalModule,
    SafepipeModule,
    FontawesomeSvgModule,
    PdfViewerModule
  ],
  exports: [MdlPdfGoogleViewComponent],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [MdlPdfGoogleViewComponent]
})
export class MdlPdfGoogleViewModule { }
