import { NgModule } from '@angular/core';
import {SafePipe} from "./safepipe";



@NgModule({
  declarations: [
    SafePipe
  ],
  // imports: [CommonModule],
  exports: [
    SafePipe
  ]
})
export class SafepipeModule { }
