import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from "@angular/material/core";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaskModule} from "ngx-mask";
import {LoaderCircleModule} from "../../../loading/loader/loader-circle/loader-circle.module";
import {FontawesomeSvgModule} from "../../../fontawesome-svg/fontawesome-svg.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {UsuarioSeleccionModule} from "../../../usuario/usuario-seleccion/usuario-seleccion.module";
import {MdlFacturaItemComponent} from "./mdl-factura-item.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRippleModule,
        LoaderCircleModule,
        FontawesomeSvgModule,
        NgbTooltipModule,
        NgxMaskModule,
        NgSelectModule,
        UsuarioSeleccionModule
    ],
    declarations: [
        MdlFacturaItemComponent
    ],
    exports: [MdlFacturaItemComponent],
    providers: [],
    bootstrap: [MdlFacturaItemComponent]
})
export class MdlFacturaItemModule { }
