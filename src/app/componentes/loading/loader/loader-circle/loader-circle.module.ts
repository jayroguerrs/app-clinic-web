import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderCircleComponent} from "./loader-circle.component";

@NgModule({
  declarations: [LoaderCircleComponent],
  imports: [
    CommonModule
  ],
  exports: [LoaderCircleComponent],
  providers: [],
  bootstrap: [LoaderCircleComponent]
})
export class LoaderCircleModule { }
