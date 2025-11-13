import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { IonicModule } from '@ionic/angular';
//import { SignaturePadModule } from 'angular2-signaturepad';
import { CitaCuponZonaComponent } from './cita-cupon-zona.component';
import { SharedModule } from '../../../theme/shared/shared.module';



@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        //SignaturePadModule,
        SharedModule,
    ],
    exports: [
        CitaCuponZonaComponent
    ],
    declarations: [
        CitaCuponZonaComponent
    ],
    providers: []
})
export class CitaCuponZonaModule { }
