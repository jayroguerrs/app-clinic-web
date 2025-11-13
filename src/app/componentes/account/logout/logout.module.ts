import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';
import { LogoutRoutingModule } from './logout-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LogoutRoutingModule
    ],
    declarations: [
        LogoutComponent,
    ],
    entryComponents: [
        LogoutComponent
      ],
})
export class LogoutModule { }