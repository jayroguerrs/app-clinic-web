import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';
import {MatRippleModule} from "@angular/material/core";
import {MdlEmisionComprobanteComponent} from "./mdl-emision-comprobante.component";
import {LoaderCircleModule} from "../../loading/loader/loader-circle/loader-circle.module";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {UsuarioSeleccionModule} from "../../usuario/usuario-seleccion/usuario-seleccion.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaskModule} from "ngx-mask";
import {DisableControlModule} from "../../../shared/directive/disable-control/disable-control.module";
import {MdlNuevoItemModule} from "../facturacion/mdl-nuevo-item/mdl-nuevo-item.module";
import {MdlDatosClienteComprobanteModule} from "../facturacion/mdl-datos-cliente-comprobante/mdl-datos-cliente-comprobante.module";
import {NgxCurrencyModule} from "ngx-currency";
import {MdlPdfGoogleViewModule} from "../mdl-pdf-google-view/mdl-pdf-google-view.module";
import {MdlListaDatosClienteComprobanteModule} from "../facturacion/mdl-lista-datos-cliente-comprobante/mdl-lista-datos-cliente-comprobante.module";
import {UsuarioSeleccionEspecialistaModule} from "../../usuario/usuario-seleccion-especialista/usuario-seleccion-especialista.module";
import {MdlFacturaItemModule} from "../facturacion/mdl-factura-item/mdl-factura-item.module";
import {MdlEmisionComprobanteMedioPagoModule} from "../mdl-emision-comprobante-medio-pago/mdl-emision-comprobante-medio-pago.module";

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
        NgxCurrencyModule,
        MdlPdfGoogleViewModule,
        MdlListaDatosClienteComprobanteModule,
        UsuarioSeleccionEspecialistaModule,
        MdlFacturaItemModule,
        MdlEmisionComprobanteMedioPagoModule
    ],
    declarations: [
        MdlEmisionComprobanteComponent
    ],
    exports: [MdlEmisionComprobanteComponent],
    providers: [],
    bootstrap: [MdlEmisionComprobanteComponent]
})
export class MdlEmisionComprobanteModule { }
