import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';
import {MatRippleModule} from "@angular/material/core";
import {LoaderCircleModule} from "../../loading/loader/loader-circle/loader-circle.module";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {UsuarioSeleccionModule} from "../../usuario/usuario-seleccion/usuario-seleccion.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaskModule} from "ngx-mask";
import {DisableControlModule} from "../../../shared/directive/disable-control/disable-control.module";
import {MdlNuevoItemModule} from "../facturacion/mdl-nuevo-item/mdl-nuevo-item.module";
import {MdlDatosClienteComprobanteModule} from "../facturacion/mdl-datos-cliente-comprobante/mdl-datos-cliente-comprobante.module";
import {NgxCurrencyModule} from "ngx-currency";
import {MdlAnularComprobanteComponent} from "./mdl-anular-comprobante.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
        ColorPickerModule,
        MatRippleModule,
        LoaderCircleModule,
        FontawesomeSvgModule,
        UsuarioSeleccionModule,
        NgbTooltipModule,
        NgxMaskModule,
        MdlDatosClienteComprobanteModule,
        DisableControlModule,
        MdlNuevoItemModule,
        NgxCurrencyModule
    ],
    declarations: [
        MdlAnularComprobanteComponent
    ],
    exports: [MdlAnularComprobanteComponent],
    providers: [],
    bootstrap: [MdlAnularComprobanteComponent]
})
export class MdlAnularComprobanteModule { }
