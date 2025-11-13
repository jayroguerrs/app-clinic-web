import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history.component';



@NgModule({
  declarations: [HistoryComponent],
  imports: [
    CommonModule
  ],
  exports: [HistoryComponent],
  providers: [],
  bootstrap: [HistoryComponent]
})
export class HistoryModule { }
