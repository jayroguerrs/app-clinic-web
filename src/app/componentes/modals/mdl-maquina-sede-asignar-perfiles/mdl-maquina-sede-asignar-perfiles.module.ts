import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MdlMaquinaSedeAsignarPerfilesComponent} from "./mdl-maquina-sede-asignar-perfiles.component";
import {MatRippleModule} from "@angular/material/core";
import {LoaderCircleModule} from "../../loading/loader/loader-circle/loader-circle.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule,
        LoaderCircleModule,
        FontawesomeSvgModule,
        NgbTooltipModule,
        NgSelectModule,
    ],
    declarations: [
      MdlMaquinaSedeAsignarPerfilesComponent
    ],
    exports: [MdlMaquinaSedeAsignarPerfilesComponent],
    providers: [],
    bootstrap: [MdlMaquinaSedeAsignarPerfilesComponent]
})
export class MdlMaquinaSedeAsignarPerfilesModule { }
