import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MapeoRrssComponent } from './mapeo-rrss/mapeo-rrss.component';
import { CampaingComponent } from './campaing/campaing.component';
import { SourceComponent } from './source/source.component';
import { MarketingRoutingModule } from './marketing-routing.module';

// Angular Material
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    MapeoRrssComponent,
    CampaingComponent,
    SourceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MarketingRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatInputModule
  ],
})
export class MarketingModule { }
