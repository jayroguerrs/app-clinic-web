import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MdlMaquinasedeTecnologiaComponent} from "./mdl-maquinasede-tecnologia.component";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FontawesomeSvgModule
    ],
    declarations: [
        MdlMaquinasedeTecnologiaComponent
    ],
    exports: [MdlMaquinasedeTecnologiaComponent],
    providers: [],
    bootstrap: [MdlMaquinasedeTecnologiaComponent]
})
export class MdlMaquinasedeTecnologiaModule { }
