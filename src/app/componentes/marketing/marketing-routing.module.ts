import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MapeoRrssComponent } from './mapeo-rrss/mapeo-rrss.component';
import { CampaingComponent } from './campaing/campaing.component';
import { SourceComponent } from './source/source.component';
import { paths as p } from '../../../commons/routes';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: p.marketing.mapeoRRSS },
    { path: p.marketing.mapeoRRSS, component: MapeoRrssComponent },
    { path: p.marketing.source, component: SourceComponent },
    { path: p.marketing.campaing, component: CampaingComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MarketingRoutingModule { }
