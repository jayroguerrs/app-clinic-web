import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlConfirmarSupervisorComponent } from './mdl-confirmar-supervisor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlayModule, OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { AutocompleteSelectModule } from '../../../shared/components/autocomplete-select';

@NgModule({
  declarations: [
    MdlConfirmarSupervisorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
    MatFormFieldModule,
    OverlayModule,
    NgbModule,
    AutocompleteSelectModule
  ],
  providers: [
    // Configuración personalizada para el overlay
    {
      provide: 'MAT_AUTOCOMPLETE_SCROLL_STRATEGY',
      useFactory: (overlay: any) => () => overlay.scrollStrategies.reposition(),
      deps: [OverlayModule]
    },
    // Usar FullscreenOverlayContainer para asegurar que los overlays sean visibles en cualquier contexto
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer }
  ],
  exports: [
    MdlConfirmarSupervisorComponent
  ]
})
export class MdlConfirmarSupervisorModule { }