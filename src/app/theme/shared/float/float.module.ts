import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatComponent } from './float.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [FloatComponent],
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [FloatComponent],
  providers: [],
  bootstrap: [FloatComponent]
})
export class FloatButtonModule { }
