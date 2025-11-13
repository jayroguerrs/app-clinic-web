import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FontawesomeSvgComponent} from "./fontawesome-svg.component";


@NgModule({
  declarations: [
    FontawesomeSvgComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [FontawesomeSvgComponent],
  providers: [],
  bootstrap: [FontawesomeSvgComponent]
})
export class FontawesomeSvgModule { }
