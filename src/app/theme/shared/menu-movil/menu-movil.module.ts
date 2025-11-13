import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuMovilComponent } from './menu-movil.component';
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule, MatBottomSheetRef} from "@angular/material/bottom-sheet";



@NgModule({
  declarations: [MenuMovilComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatBottomSheetModule
  ],
  exports: [MenuMovilComponent],
  providers: [{ provide: MatBottomSheetRef, useValue: {} }],
  bootstrap: [MenuMovilComponent]
})
export class MenuMovilModule { }
