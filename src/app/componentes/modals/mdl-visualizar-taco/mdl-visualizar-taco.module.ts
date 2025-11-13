import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../theme/shared/shared.module";
import {MdlVisualizarTacoComponent} from "./mdl-visualizar-taco.component";
import {MatRippleModule} from "@angular/material/core";
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MatRippleModule,

        PdfViewerModule 
    ],
    declarations: [
        MdlVisualizarTacoComponent
    ],
    exports: [MdlVisualizarTacoComponent],
    providers: [],
    bootstrap: [MdlVisualizarTacoComponent]
})
export class MdlVisualizarTacoModule { }
